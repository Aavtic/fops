package database

import (
)

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

type InputOutput struct {
	Input string `json:"input" bson:"input"`
	Output string `json:"output" bson:"output"`
}

type AddProblemRequestType struct {
	Title string `json:"title"`
	Description string `json:"description"`
	FunctionName string `json:"function_name"`
	ParameterName string `json:"parameter_name"`
	InputType string `json:"input_type"`
	OutputType string `json:"output_type"`
	InputOutput []InputOutput `json:"input_output"` 
}

type DBAddProblemRequestType struct {
	ProblemId string `bson:"uid"`
	Title string `bson:"title"`
	TitleSlug string `bson:"title_slug"`
	Description string `bson:"description"`
	FunctionName string `bson:"function_name"`
	ParameterName string `bson:"parameter_name"`
	InputType string `bson:"input_type"`
	OutputType string `bson:"output_type"`
	InputOutput []InputOutput `bson:"input_output"`
	CodeTemplate string `json:"code_template"`
}

type DBProblemType = DBAddProblemRequestType;
