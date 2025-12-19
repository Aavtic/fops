package auth

import (
	"fmt"
	"net/http"
	"encoding/json"

	"github.com/aavtic/fops/internal/database"
	"github.com/aavtic/fops/internal/database/models"

	"github.com/gin-gonic/gin"
)


type AuthHandler struct {
	secretKey string
}

func NewAuthHandler(secretKey string) *AuthHandler {
	return &AuthHandler{
		secretKey: secretKey,
	}
}

func (*AuthHandler) Signup(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		// var loginReq = requests.LoginRequest 
		//
		// if c.Bind(&json) == nil {
		// } else {
		// 	c.JSON(http.StatusBadRequest, gin.H{"status": "invalid request json"})
		// }
	}
}

func (auth *AuthHandler) Login(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
  c.Header("Content-Type", "application/json")

	var u models.User
  json.NewDecoder(c.Request.Body).Decode(&u)
  fmt.Printf("The user request value %v", u)
  
  if u.Username == "Chek" && u.Password == "123456" {
    tokenString, err := createToken(u.Username, auth.secretKey)
    if err != nil {
       c.Status(http.StatusInternalServerError)
       fmt.Errorf("No username found")
     }
    c.Status(http.StatusOK)
    fmt.Fprint(c.Writer, tokenString)
    return
  } else {
    c.Status(http.StatusUnauthorized)
    fmt.Fprint(c.Writer, "Invalid credentials")
  }
	}
}

func (*AuthHandler) Logout(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
	}
}

func (*AuthHandler) Me(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
	}
}

func (*AuthHandler) Refresh(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
	}
}
