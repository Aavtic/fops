package server;

// SAMPLE
// {
//   "title": "asdf",
//   "description": "asdf",
//   "function_name": "asdf",
//	 "parameter_name": "n",
//   "input_type": "List[float]",
//   "output_type": "List[int]",
//   "input_output": [
//     {
//       "input": "asdf",
//       "output": "asdf"
//     }
//   ]
// }
type AddProblemRequestType struct {
	Title string `json:"title"`
	Description string `json:"description"`
	FunctionName string `json:"function_name"`
	ParameterName string `json:"parameter_name"`
	InputType string `json:"input_type"`
	OutputType string `json:"output_type"`
	InputOutput []struct {
		Input string `json:"input"`
		Output string `json:"output"`
	} `json:"input_output"`
}

type DBAddProblemRequestType struct {
	Title string `json:"title"`
	TitleSlug string `json:"titleSlug"`
	Description string `json:"description"`
	FunctionName string `json:"function_name"`
	ParameterName string `json:"parameter_name"`
	InputType string `json:"input_type"`
	OutputType string `json:"output_type"`
	InputOutput []struct {
		Input string `json:"input"`
		Output string `json:"output"`
	}
}
