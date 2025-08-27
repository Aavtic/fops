package server

import (
	"log"
	"github.com/aavtic/fops/internal/env"
	"github.com/aavtic/fops/internal/launcher/python-launcher"
	"github.com/aavtic/fops/utils/fs"
	"github.com/aavtic/fops/utils/logging"
)

func Run() {
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
