package problem

import (
	"log"
	"net/http"

	"github.com/aavtic/fops/internal/database"
	"github.com/aavtic/fops/internal/database/models"
	"github.com/aavtic/fops/utils/markdown"
	"github.com/aavtic/fops/utils/templates"
	"github.com/aavtic/fops/internal/config"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gosimple/slug"
)


type ProblemHandler struct {
	cfg *config.Config
}

func NewProblemHandler(cfg *config.Config) ProblemHandler {
	return ProblemHandler {
		cfg: cfg,
	}
}


func (ph *ProblemHandler) Get_question_details_handler(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Println("DB: ", ph.cfg.DB.Database);
		log.Println("Collection: ", ph.cfg.DB.ProblemsCollection);
		slug_title := c.Params.ByName("title_slug")
		log.Println("slug: ", slug_title, "length: ", len(slug_title))
		var db_response models.DBAddProblemRequestType
		// TODO: This responds with the whole record. we don't need everything
		// this returns including the testcases
		// just return the title, description
		filter := database.M{"title_slug": slug_title}
		err := database.FindOneDocument(db, ph.cfg.DB.Database, ph.cfg.DB.ProblemsCollection, filter, &db_response)
		if err != nil {
			if err == database.NO_DOCUMENTS {
				c.JSON(http.StatusNotFound, gin.H{"status": "Document not Found"})
			} else {
				log.Printf("ERROR: Error in finding document due to: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"status": "Server Error"})
			}
			return
		}

		log.Printf("DB Response: %v", db_response)
		type ResponseJson struct {
			ID           		string `json:"id"`
			Title        		string `json:"title"`
			Description  		string `json:"description"`
			DescriptionHTML string `json:"description_html"`
			CodeTemplate 		string `json:"code_template"`
		}
		var response ResponseJson
		response.ID = db_response.ProblemId
		response.Title = db_response.Title
		response.Description = db_response.Description
		response.DescriptionHTML = db_response.DescriptionHTML
		response.CodeTemplate = db_response.CodeTemplate

		log.Printf("Found Document: %v", response)
		c.JSON(http.StatusOK, response)
	}
}

func (ph *ProblemHandler) Get_all_problems(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		problems_list := make([]models.DBProblemType, 0)
		if err := database.FindAllDocuments(db, ph.cfg.DB.Database, ph.cfg.DB.ProblemsCollection, database.D{}, &problems_list); err != nil {
			log.Println("ERROR: ", err);
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching data from database"});
		} else {
			filteredData := database.FilterProblemData(problems_list)
			c.JSON(http.StatusOK, gin.H{"problems": filteredData});
		}
	}
}

func (ph *ProblemHandler) Add_question_handler(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		var json models.AddProblemRequestType
		if c.Bind(&json) == nil {
			problemRepo := database.NewProblemRepository(db, ph.cfg)
			// log.Printf("Got json: %v", json)
			md := []byte(json.Description)
			html := markdown.MDToHTML(md)

			db_json := processJSON(json, string(html))
			log.Println("PROCESSED JSON", db_json)

			log.Println("HTML:", db_json.DescriptionHTML)

			err := problemRepo.CreateProblem(db_json)

			if err != nil {
				log.Printf("error while inserting document to database: %v", err)
				c.JSON(http.StatusOK, gin.H{"status": "error"})
			} else {
				log.Println("Successfully inserted document to database")
				c.JSON(http.StatusOK, gin.H{"status": "success"})
			}
		}
	}
}

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
