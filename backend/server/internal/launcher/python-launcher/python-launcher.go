package pythonlauncher

import (
	"os"
	"io"
	"fmt"
	"log"
	"os/exec"
	"github.com/aavtic/fops/utils/fs"
)

const DEBUG_MODE = true

const JUDGE string = "../code_execution/language_execution/python_test/judge.py" 
// COMMAND: PYTHONPATH=<source_path> python3 JUDGE --output <output_path>

func Launch(source_path, output_path, problem_template string) (string, error) {
	var response string

	binary := "python3"
	cmd := exec.Command(
		binary,

		// ARGS
		JUDGE,
		"--output",
		output_path,
	)
	cmd.Env = append(os.Environ(), "PYTHONPATH="+source_path)
	log.Println("PYTHONPATH=", source_path)
	log.Println("Cmd: ", cmd.Args)
	log.Println("Dir: ", cmd.Dir)
	if DEBUG_MODE {
		log.Println("Recreational command: ", fmt.Sprintf(`echo '%s' | PYTHONPATH=%s python3 %s --output %s`,
		problem_template,
		source_path,
		JUDGE,
		output_path,
	))
	}
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return response, err
	}
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return response, err
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return response, err
	}

	err = cmd.Start()
	if err != nil {
		return response, err
	}

	stdin.Write([]byte(problem_template))
	stdin.Close()

	outputBytes, _ := io.ReadAll(stdout)
	log.Println("Stdout: ", string(outputBytes))

	errBytes, _ := io.ReadAll(stderr)
	log.Println("Stderr: ", string(errBytes))
	
	err = cmd.Wait()


	if err != nil {
		return response, err
	}


	response, err = fs.GetFileContents(output_path)

	return response, nil
}
