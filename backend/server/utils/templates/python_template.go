package templates

import (
	"fmt"
)

func GeneratePythonTemplate(func_name, para_name, para_type, output_type string) string {
	return fmt.Sprintf(`This project is free and open-source
please report any issues you find at
FOPS: https://github.com/aavtic/fops/issues

class Solution:
    def %s(%s: %s) -> %s:
		    # Write your code here

`, func_name, para_name, ToPythonType(para_type), ToPythonType(output_type))
}
