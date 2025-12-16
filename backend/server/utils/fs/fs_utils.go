package fs

import (
	"fmt"
	"os"
	"os/exec"
)

func CreateTempDir(path, prefix string) (string, error) {
	// UNIX Specific
	// TODO: Create Cross platform solution
	binary := "mktemp"
	args_arr := []string {
		"-d",
		fmt.Sprintf("%s/%sXXXX", path, prefix),
	}
	fmt.Println(binary, args_arr[0], args_arr[1]);
	cmd := exec.Command(binary, args_arr[0], args_arr[1])
	output, err := cmd.Output()
	if (err != nil) {
		return "", err
	}

	var skip int = len(output)-1
	return string(output[:skip]), nil
}

func Create_file(file_name string) (*os.File, error) {
	file, err := os.Create(file_name)
	if (err != nil) {
		return nil, err
	}
	return file, nil
}

// Helper function
func Create_file_and_write(file_name, contents string) error {
	file, err := Create_file(file_name)
	if err != nil {
		return err
	}
	_, err = file.WriteString(contents)
	return err;
}

func GetFileContents(file_name string) (string, error) {
	file_content, err := os.ReadFile(file_name)
	return string(file_content), err
}
