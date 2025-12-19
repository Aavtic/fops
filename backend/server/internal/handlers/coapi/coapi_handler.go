package coapi

import (
	"log"
	"net/http"
	"encoding/json"

	"github.com/aavtic/fops/internal/database"
	"github.com/aavtic/fops/internal/config"
	"github.com/aavtic/fops/internal/database/models"
	"github.com/aavtic/fops/internal/coapi"
	"github.com/aavtic/fops/utils/logging"
	"github.com/aavtic/fops/internal/launcher/python-launcher"
	"github.com/aavtic/fops/utils/fs"
	"github.com/aavtic/fops/internal/env"


	"github.com/gin-gonic/gin"
)


type CoapiHandler struct {
	cfg *config.Config
}

func NewCoapiHandler(cfg *config.Config) CoapiHandler {
	return CoapiHandler {
		cfg: cfg,
	}
}

func (ch *CoapiHandler) Test_code_handler(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		var request coapi.TestQuestionRequest
		if c.Bind(&request) == nil {
			var response models.DBProblemType
			log.Println("ID: ", request.ID)
			log.Println("Request: ", request)
			id := request.ID
			log.Printf("ID: %v", id)
			filter := database.M{"uid": id}
			err := database.FindOneDocument(db, ch.cfg.DB.Database, ch.cfg.DB.ProblemsCollection, filter, &response)
			if err != nil {
				log.Printf("ERROR: Could not find document due to: %v\n", err)
				c.JSON(http.StatusBadRequest, gin.H{"error": "Could not find problem with that id. Please refer https://github.com/aavtic/fops"})
				return
			}
			log.Printf("SUCCESS: Found document: %v\n", response)

			question_template := coapi.QuestionTemplate{
				ID:           response.ProblemId,
				Title:        response.Title,
				Description:  response.Description,
				FunctionName: response.FunctionName,
				InputType:    response.InputType,
				OutputType:   response.OutputType,
				InputOutput:  response.InputOutput,
			}

			template, err := json.Marshal(question_template)
			if err != nil {
				log.Println("ERROR: Could not marshall data due to: ", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "An unexpected error occured in the server. oops..."})
				return
			}

			coapi_response_any, err := TestCode(request.Lang, request.Code, string(template))
			if err != nil {
				log.Printf("ERROR: Could not get coapi json due to %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "An unexpected error occured in the server. oops..."})
			}
			log.Printf("INFO: COAPI RESPONSE: %v", coapi_response_any)

			c.JSON(http.StatusOK, coapi_response_any)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing expected values in json. Please refer https://github.com/aavtic/fops"})
		}
	}
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
