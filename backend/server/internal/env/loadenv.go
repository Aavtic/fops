package env

import (
	"os"
	"log"
	"encoding/json"
)


const ENV_PATH string = "../../fops.json"

type EnvVars struct {
	Code_storage string			`json:"code_storage"`
	Code_templates string		`json:"code_templates"`
	Output_details string		`json:"output_details"`
}

func LoadEnv() EnvVars {
	env_contents, err := os.ReadFile(ENV_PATH)
	if err != nil {
		log.Fatal("Could not load ", ENV_PATH, "due to ", err)
	}

	// fmt.Println(string(env_contents))

	var env_vars EnvVars
	err = json.Unmarshal(env_contents, &env_vars)
	if err != nil {
		log.Fatal("Could not parse ", ENV_PATH, "due to ", err)
	}

	return env_vars
}
