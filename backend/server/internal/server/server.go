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
)

var PORT int = 8080

// TODO:
// making this global is not a good idea
// create a rw lock on this so that it is thread safe

func SetupRouter(db *database.Database) *gin.Engine {
	r := gin.Default()
	
	r.POST("/api/db/add_question", func(c *gin.Context) {
		var json AddProblemRequestType
		if c.Bind(&json) == nil {
			log.Printf("Got json: %v", json)
			err := db.InsertOne("fops", "problems", json)
			if err != nil {
				log.Printf("error while inserting document to database: %v", err)
				c.JSON(http.StatusOK, gin.H{"status": "error"})
			} else {
				log.Println("Successfully inserted document to database")
				c.JSON(http.StatusOK, gin.H{"status": "success"})
			}
		}
	})

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
