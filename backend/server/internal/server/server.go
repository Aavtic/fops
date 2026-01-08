package server

import (
	"fmt"
	"log"

	"github.com/aavtic/fops/internal/database"
	"github.com/aavtic/fops/internal/config"
	auth_handler "github.com/aavtic/fops/internal/handlers/auth"
	problem_handler "github.com/aavtic/fops/internal/handlers/problem"
	coapi_handler "github.com/aavtic/fops/internal/handlers/coapi"
	markdown_handler "github.com/aavtic/fops/internal/handlers/markdown"
	user_handler "github.com/aavtic/fops/internal/handlers/user"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

type Server struct {
	Config config.Config
}

func NewServer(cfg *config.Config) *Server {
	return &Server {
		Config: *cfg,
	}
}

func (s *Server) SetupRouter(db *database.Database) *gin.Engine {
	r := gin.Default()

	var corsConfig = cors.Config{
			AllowOrigins: []string{
				fmt.Sprintf("http://%s:3000", s.Config.Host.HostIP),
			},
			AllowMethods: []string{
					"GET", "POST", "PUT", "DELETE", "OPTIONS",
			},
			AllowHeaders: []string{
					"Origin",
					"Content-Type",
					"Authorization",
			},
			ExposeHeaders: []string{
					"Content-Length",
			},
			AllowCredentials: true,
	} 

	r.Use(cors.New(corsConfig))

	authHandler := auth_handler.NewAuthHandler(&s.Config);
	problemHandler := problem_handler.NewProblemHandler(&s.Config)
	coapiHandler := coapi_handler.NewCoapiHandler(&s.Config)
	markdownHandler := markdown_handler.NewMarkdownHandler()
	userHandler := user_handler.NewUserHandler(&s.Config)

	apiRoutes := r.Group("/api")
	authRoutes := apiRoutes.Group("/auth")

	dbRoutes := apiRoutes.Group("/db");
	markdownRoutes := apiRoutes.Group("/markdown", authHandler.AuthMiddleware());
	testingRoutes := apiRoutes.Group("/coapi", authHandler.AuthMiddleware());

	// Auth routes
	authRoutes.POST("/signup",  authHandler.Signup(db))
	authRoutes.POST("/login",   authHandler.Login(db))
	authRoutes.POST("/logout",  authHandler.Logout(db))
	authRoutes.GET("/me",      authHandler.Me(db))
	authRoutes.POST("/refresh", authHandler.Refresh(db))

	// Database routes
	dbRoutes.GET("/problem/:title_slug", problemHandler.Get_question_details_handler(db), authHandler.AuthMiddleware())
	dbRoutes.GET("/problem", problemHandler.Get_all_problems(db), authHandler.AuthMiddleware());
	dbRoutes.POST("/problem", problemHandler.Add_question_handler(db), authHandler.AuthMiddleware())

	// User DB routes
	dbRoutes.GET("/user/:user_id", userHandler.GetUserDetails(db))

	// Markdown routes
	markdownRoutes.POST("/render", markdownHandler.Render_custom_markdown())

	// Code testing routes
	testingRoutes.POST("/test", coapiHandler.Test_code_handler(db))

	return r
}

func (s *Server) Run() {
	db := database.Connect(s.Config.DB.ConnectionString)
	defer db.Disconnect()
	r := s.SetupRouter(db)

	host := s.Config.Host.HostIP
	port := s.Config.Host.HostPort

	server_address := fmt.Sprintf("%s:%d", host, port)

	log.Printf("Server up and running on port :%d", port)
	r.Run(server_address)
}
