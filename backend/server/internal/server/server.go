package server

import (
	"fmt"
	"log"

	"github.com/aavtic/fops/internal/database"
	"github.com/aavtic/fops/internal/database/models"
	"github.com/aavtic/fops/internal/config"
	"github.com/aavtic/fops/utils/templates"
	"github.com/aavtic/fops/internal/handlers/auth"
	problem_handler "github.com/aavtic/fops/internal/handlers/problem"
	coapi_handler "github.com/aavtic/fops/internal/handlers/coapi"
	markdown_handler "github.com/aavtic/fops/internal/handlers/markdown"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"github.com/google/uuid"
	"github.com/gosimple/slug"
)


type Server struct {
	Config config.Config
}

func NewServer(cfg *config.Config) *Server {
	return &Server {
		Config: *cfg,
	}
}

const PORT int = 8080
const DATABASE string = "fops"
const COLLECTION string = "problems"

// TODO
// Ensure that title is unique
func processJSON(json models.AddProblemRequestType, markdown_html string) models.DBAddProblemRequestType {
	title := json.Title
	slug_title := slug.Make(title)
	// TODO:
	// Make this language agnostic
	python_template := templates.GeneratePythonTemplate(json.FunctionName, json.ParameterName, json.InputType, json.OutputType)
	log.Println("created python template code:", python_template)
	var db_json = models.DBAddProblemRequestType{
		ProblemId:     uuid.New().String(),
		Title:         json.Title,
		TitleSlug:     slug_title,
		Description:   json.Description,
		DescriptionHTML: markdown_html,
		FunctionName:  json.FunctionName,
		ParameterName: json.ParameterName,
		InputType:     json.InputType,
		OutputType:    json.OutputType,
		InputOutput:   json.InputOutput,
		CodeTemplate:  python_template,
	}

	log.Println("Function name: ", json.FunctionName)
	log.Println("Input name: ", json.ParameterName)
	log.Println("Input Type : ", json.InputType)

	return db_json
}

func (s *Server) SetupRouter(db *database.Database) *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default())

	apiRoutes := r.Group("/api")

	authHandler := auth.NewAuthHandler(s.Config.Auth.SECRET);
	problemHandler := problem_handler.NewProblemHandler(&s.Config)
	coapiHandler := coapi_handler.NewCoapiHandler(&s.Config)
	markdownHandler := markdown_handler.NewMarkdownHandler()

	// Auth routes
	authRoutes := apiRoutes.Group("/auth")
	authRoutes.POST("/signup",  authHandler.Login(db))
	authRoutes.POST("/login",   authHandler.Signup(db))
	authRoutes.POST("/logout",  authHandler.Logout(db))
	authRoutes.POST("/me",      authHandler.Me(db))
	authRoutes.POST("/refresh", authHandler.Refresh(db))

	// Database routes
	dbRoutes := apiRoutes.Group("/db")
	dbRoutes.GET("/problem/:title_slug", problemHandler.Get_question_details_handler(db))
	dbRoutes.GET("/problem", problemHandler.Get_all_problems(db));
	dbRoutes.POST("/problem", problemHandler.Add_question_handler(db))

	// Markdown routes
	markdownRoutes := apiRoutes.Group("/markdown");
	markdownRoutes.POST("/render", markdownHandler.Render_custom_markdown())

	// Code testing routes
	testingRoutes := apiRoutes.Group("/coapi");
	testingRoutes.POST("/test", coapiHandler.Test_code_handler(db))

	return r
}

func (s *Server) Run() {
	db := database.Connect("mongodb://localhost:27017/")
	defer db.Disconnect()
	r := s.SetupRouter(db)

	log.Printf("Server up and running on port :%d", PORT)
	r.Run(":" + fmt.Sprintf("%d", PORT))
}
