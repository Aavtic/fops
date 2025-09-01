package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/aavtic/fops/internal/env"
	"github.com/aavtic/fops/internal/launcher/python-launcher"
	"github.com/aavtic/fops/utils/fs"
	"github.com/aavtic/fops/utils/logging"
	"github.com/aavtic/fops/internal/database"

	"github.com/gin-gonic/gin"
	"github.com/gosimple/slug"
)

var PORT int = 8080
var DATABASE string = "fops"
var COLLECTION string = "problems"

// TODO
// Ensure that title is unique
func processJSON(json *AddProblemRequestType) DBAddProblemRequestType {
	title := json.Title
	slug_title := slug.Make(title)
	var db_json DBAddProblemRequestType
	db_json.Title = json.Title
	db_json.TitleSlug = slug_title
	db_json.Description = json.Description
	db_json.FunctionName = json.FunctionName
	db_json.ParameterName = json.ParameterName
	db_json.InputType = json.InputType
	db_json.OutputType = json.OutputType
	db_json.InputOutput = json.InputOutput

	return db_json
}

func add_question_handler(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
			var json AddProblemRequestType
			if c.Bind(&json) == nil {
				log.Printf("Got json: %v", json)
				db_json := processJSON(&json)
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
		var db_response DBAddProblemRequestType
		// TODO: This responds with the whole record. we don't need everything
		// this returns including the testcases
		// just return the title, description
		filter := database.D{{Key: "titleslug", Value: slug_title}}
		err := database.FindOneDocument(db, DATABASE, COLLECTION, filter, &db_response)
		if (err != nil) {
			if (err == database.NO_DOCUMENTS) {
				c.JSON(http.StatusNotFound, gin.H{"status": "Document not Found"})
			} else {
				log.Printf("ERROR: Error in finding document due to: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"status": "Server Error"})
			}
			return
		}
		type ResponseJson struct {
			Title string `json:"title"`
			Description string `json:"description"`
		}
		var response ResponseJson
		response.Title = db_response.Title
		response.Description = db_response.Description

		log.Printf("Found Document: %v", response)
		c.JSON(http.StatusOK, response)
	}
}

func SetupRouter(db *database.Database) *gin.Engine {
	r := gin.Default()

	r.GET("/api/db/get_question_details/:title_slug", get_question_details_handler(db))
	r.POST("/api/db/add_question", add_question_handler(db))

	return r
}

func Run() {
	db := database.Connect("mongodb://localhost:27017/");
	defer db.Disconnect()
	r := SetupRouter(db)

	log.Printf("Server up and running on port :%d", PORT)
	r.Run(":" + fmt.Sprintf("%d", PORT))
}

func Run2() {
	log.Println("[+] Server up and running...")
	env_vars := env.LoadEnv()

	logging.LogAll(
		"Code storage: "+env_vars.Code_storage,
		"Output details: " + env_vars.Output_details,
		"Code templates: " + env_vars.Code_templates,
	)

	// Temp

	temp_dir, err := fs.CreateTempDir(env_vars.Code_storage, "py")
	logging.ExitIfError(err, "Could not create temp dir due to")
	
	temp_code := `
class Solution:
    def fibonacci(self, n):
        if n <= 2: return 1
        return self.fibonacci(n-2) + self.fibonacci(n-1) 
`

	problem_template := `
{
    "title": "Fibonacci",
    "description": "Fibo!",
    "function_name": "fibonacci",
    "input_type": "Integer",
    "output_type": "Integer",
    "input_output": [
        [[0], 1],
        [[1], 1],
        [[2], 1],
        [[3], 2],
        [[5], 5]
    ]
}
	`

	code_file := temp_dir + "/main.py"
	logging.ExitIfError(fs.Create_file_and_write(code_file, temp_code), "Could not create or write to " + code_file + " due to ")

	log.Println("Written to file successfully!")

	response, err := pythonlauncher.Launch(temp_dir, "./output.json", problem_template)
	logging.ExitIfError(err, "Could not run Launch python program due to ")

	log.Println(response)
}
