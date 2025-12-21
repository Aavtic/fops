package auth

import (
	"log"
	"time"
	"net/http"
	"strings"

	"github.com/aavtic/fops/internal/database"
	"github.com/aavtic/fops/internal/requests"
	"github.com/aavtic/fops/internal/config"
	"github.com/aavtic/fops/internal/database/models"

	"golang.org/x/crypto/bcrypt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)


type AuthHandler struct {
	cfg 			*config.Config
}

func NewAuthHandler(cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		cfg:			 cfg,
	}
}

func (ah *AuthHandler) Signup(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		var signupReq requests.SignupRequest 

		if c.Bind(&signupReq) == nil {
			// validation
			err := signupReq.Validate()
			if err != nil {
				log.Println(err)
				c.JSON(http.StatusBadRequest, gin.H{"error": err})
				return
			}

			// Check if user with same email exists
			email := signupReq.Email
			exists, err := database.CheckDocumentExists(db, ah.cfg.DB.Database, ah.cfg.DB.UsersCollection, gin.H{"email": email})

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not lookup user"})
				log.Println("ERROR: Could not check if email exists: ", err)
				return
			}

			if exists {
				c.JSON(http.StatusConflict, gin.H{"error": "user already exists"})
				return
			}

			// add user to db
			password := signupReq.Password
			hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

			now := time.Now().UTC()

			userModel := models.User {
				UserID:		uuid.New().String(),
				Username: signupReq.Username,
				PasswordHash: string(hash),
				Email: 	signupReq.Email,
				CreatedAt: now,
				ModifiedAt: now,
				DeletedAt: nil,
			}

			// create user
			err = db.InsertOne(ah.cfg.DB.Database, ah.cfg.DB.UsersCollection, userModel)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"status": "Error writing data to database"})
				log.Println("ERROR: Could not insert data to database due to : ", err)
				return;
			}

			c.JSON(http.StatusOK, gin.H{"status": "User created successfully"})
			// respond ok
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"status": "invalid request json"})
		}
	}
}

func (auth *AuthHandler) Login(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Content-Type", "application/json")

		var loginReq requests.LoginRequest
		if c.Bind(&loginReq) == nil {
			log.Printf("The user request value %v", loginReq)


			// Check if email exists and if password hash are equal
			email := loginReq.Email;
			exists, err := database.CheckDocumentExists(
				db,
				auth.cfg.DB.Database,
				auth.cfg.DB.UsersCollection,
				database.M{"email": email},
			)

			if err != nil {
				log.Printf("1. ERROR: could not fetch user details from db: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
				return
			}

			if !exists {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "user does not exist"})
				return
			}

			var user models.User

			err = database.FindOneDocument(
				db,
				auth.cfg.DB.Database,
				auth.cfg.DB.UsersCollection,
				database.M{"email": email},
				&user,
			)

			if err != nil {
				log.Printf("2. ERROR: could not fetch user details from db: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
				return
			}

			if err := bcrypt.CompareHashAndPassword(
				[]byte(user.PasswordHash),
				[]byte(loginReq.Password),
			); err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
				return
			}

			// Create token
			tokenString, err := createToken(user.Username, user.Email, auth.cfg.Auth.SECRET)
			if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
					log.Printf("ERROR: Could not create token due to %s", err)
					c.Abort()
					return
			 }

			 c.SetCookie(
			 		"auth",           // name
			 		tokenString,      // value
			 		60*60*24,         // maxAge (seconds)
			 		"/",              // path
			 		"localhost",      // domain (dev only)
			 		false,            // secure (true in prod)
			 		true,             // httpOnly
			 )

				c.JSON(http.StatusOK, gin.H{
						"message": "login successful",
				})


			} else {
				c.JSON(http.StatusBadRequest, gin.H{"status": "invalid request json"})
			}
	}
}

func (*AuthHandler) Logout(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
	}
}

func (ah *AuthHandler) Me(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Read HTTP-only cookie named "auth"
		token, err := c.Cookie("auth")
		if err != nil {
			// Cookie not present
			c.Status(http.StatusUnauthorized)
			return
		}

		log.Println("Token from cookie:", token)

		// Verify JWT
		if err := verifyToken(token, ah.cfg.Auth.SECRET); err != nil {
			c.Status(http.StatusUnauthorized)
			return
		}

		c.Status(http.StatusOK)
	}
}


func (*AuthHandler) Refresh(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
	}
}
func (ah *AuthHandler) AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {

        var token string

        // 1️⃣ Try cookie first (preferred)
        if cookie, err := c.Cookie("auth"); err == nil {
            token = cookie
        }

        // 2️⃣ Fallback to Authorization header (optional)
        if token == "" {
            authHeader := c.GetHeader("Authorization")
            if strings.HasPrefix(authHeader, "Bearer ") {
                token = strings.TrimPrefix(authHeader, "Bearer ")
            }
        }

        if token == "" {
            c.AbortWithStatus(http.StatusUnauthorized)
            return
        }

        err := verifyToken(token, ah.cfg.Auth.SECRET)
        if err != nil {
            c.AbortWithStatus(http.StatusUnauthorized)
            return
        }

        // c.Set("user", claims)

        c.Next()
    }
}
