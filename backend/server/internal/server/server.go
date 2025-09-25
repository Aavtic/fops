package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/aavtic/fops/internal/coapi"
	"github.com/aavtic/fops/internal/database"
	"github.com/aavtic/fops/internal/env"
	"github.com/aavtic/fops/internal/launcher/python-launcher"
	"github.com/aavtic/fops/utils/fs"
	"github.com/aavtic/fops/utils/logging"
	"github.com/aavtic/fops/utils/templates"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gosimple/slug"
	// "go.mongodb.org/mongo-driver/bson/primitive"
)

const PORT int = 8080
const DATABASE string = "fops"
const COLLECTION string = "problems"

// TODO
// Ensure that title is unique
func processJSON(json database.AddProblemRequestType) database.DBAddProblemRequestType {
	title := json.Title
	slug_title := slug.Make(title)
	// TODO:
	// Make this language agnostic
	python_template := templates.GeneratePythonTemplate(json.FunctionName, json.ParameterName, json.InputType, json.OutputType)
	log.Println("created python template code:", python_template)
	var db_json = database.DBAddProblemRequestType{
		ProblemId:     uuid.New().String(),
		Title:         json.Title,
		TitleSlug:     slug_title,
		Description:   json.Description,
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

func add_question_handler(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		var json database.AddProblemRequestType
		if c.Bind(&json) == nil {
			// log.Printf("Got json: %v", json)
			db_json := processJSON(json)
			log.Println("PROCESSED JSON", db_json)
			err := db.InsertOne(DATABASE, COLLECTION, db_json)
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

func get_question_details_handler(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		slug_title := c.Params.ByName("title_slug")
		log.Println("slug: ", slug_title, "length: ", len(slug_title))
		var db_response database.DBAddProblemRequestType
		// TODO: This responds with the whole record. we don't need everything
		// this returns including the testcases
		// just return the title, description
		filter := database.M{"title_slug": slug_title}
		err := database.FindOneDocument(db, DATABASE, COLLECTION, filter, &db_response)
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
			ID           string `json:"id"`
			Title        string `json:"title"`
			Description  string `json:"description"`
			CodeTemplate string `json:"code_template"`
		}
		var response ResponseJson
		response.ID = db_response.ProblemId
		response.Title = db_response.Title
		response.Description = db_response.Description
		response.CodeTemplate = db_response.CodeTemplate

		log.Printf("Found Document: %v", response)
		c.JSON(http.StatusOK, response)
	}
}

// POST REQUEST
// Expected Data
//
//	{
//		"id": <question unique id>,
//		"code": <code>,
//		"lang": <language>,
//	}
func test_code_handler(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		var request coapi.TestQuestionRequest
		if c.Bind(&request) == nil {
			var response database.DBProblemType
			log.Println("ID: ", request.ID)
			log.Println("Request: ", request)
			id := request.ID
			log.Printf("ID: %v", id)
			filter := database.M{"uid": id}
			err := database.FindOneDocument(db, DATABASE, COLLECTION, filter, &response)
			if err != nil {
				log.Printf("ERROR: Could not find document due to: %v\n", err)
				c.JSON(http.StatusBadRequest, gin.H{"error": "Could not find problem with that id. Please refer https://github.com/aavtic/fops"})
				return
			}
			log.Printf("SUCCESS: Found document: %v\n", response)

			question_template := coapi.QuestionTemplate{
				ID: response.ProblemId,
				Title: response.Title,
				Description: response.Description,
				FunctionName: response.FunctionName,
				InputType: response.InputType,
				OutputType: response.OutputType,
				InputOutput: response.InputOutput,
			}

			template, err := json.Marshal(question_template)
			if err != nil {
				log.Println("ERROR: Could not marshall data due to: ", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "An unexpected error occured in the server. oops..."})
				return
			}

			coapi_response, err := TestCode(request.Lang, request.Code, string(template))
			if err != nil {
				log.Printf("ERROR: Could not get coapi json due to %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "An unexpected error occured in the server. oops..."})
			}
			log.Printf("INFO: COAPI RESPONSE: %v", coapi_response)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing expected values in json. Please refer https://github.com/aavtic/fops"})
		}
	}
}

func SetupRouter(db *database.Database) *gin.Engine {
	r := gin.Default()

	r.GET("/api/db/get_question_details/:title_slug", get_question_details_handler(db))
	r.POST("/api/db/add_question", add_question_handler(db))
	r.POST("/api/coapi/test", test_code_handler(db))
	return r
}

func Run() {
	db := database.Connect("mongodb://localhost:27017/")
	defer db.Disconnect()
	r := SetupRouter(db)

	log.Printf("Server up and running on port :%d", PORT)
	r.Run(":" + fmt.Sprintf("%d", PORT))
}

func TestCode(language, code, problem_template string) (coapi.Response, error) {
	_ = language
	log.Println("[+] Server up and running...")
	env_vars := env.LoadEnv()

	logging.LogAll(
		"Code storage: "+env_vars.Code_storage,
		"Output details: "+env_vars.Output_details,
		"Code templates: "+env_vars.Code_templates,
	)

	// Temp

	temp_dir, err := fs.CreateTempDir(env_vars.Code_storage, "py")
	logging.ExitIfError(err, "Could not create temp dir due to")

	code_file := temp_dir + "/main.py"
	err = fs.Create_file_and_write(code_file, code)
	if err != nil {
		log.Println("Could not create and file or write to file: ", err)
		return coapi.Response{}, err
	}

	log.Println("Written to file successfully!")

	response_str, err := pythonlauncher.Launch(temp_dir, "./output.json", problem_template)
	// TODO: LOG the error don't exit
	logging.ExitIfError(err, "Could not run Launch python program due to ")
	log.Println("INFO: JUDGE RESPONSE: ", response_str)
	response, err := coapi.GetResponseJson(response_str)
	if err != nil {
		log.Printf("ERROR: FAILED TO PARSE JUDGE RESPONSE DUE TO %v", err)
		return coapi.Response{}, err
	}
	return response, nil
}
