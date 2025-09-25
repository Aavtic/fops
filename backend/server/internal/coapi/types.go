// COAPI -> Code Output API
package coapi 

import (
	"encoding/json"
	"github.com/aavtic/fops/internal/database"
)


// {
// 	"id": <question unique id>,
// 	"code": <code>,
// 	"lang": <language>,
// }
type TestQuestionRequest struct {
	ID string `json:"problem_id"`
	Code string `json:"code"`
	Lang string `json:"lang"`
}

type QuestionTemplate struct {
		ID string `json:"id"`
		Title string `json:"title"`
		Description string `json:"description"`
		FunctionName string `json:"function_name"`
		InputType string `json:"input_type"`
		OutputType string `json:"output_type"`
		InputOutput []database.InputOutput  `json:"input_output"`
}

// {
// 	"status": "URCodeErrorLOL",
// 	"info": 
// 	{
// 		"URCodeErrorLOL": {
// 			"error": "%s"
// 		}
// 	}
// }
// {
//         "status": "Fail",
//         "info": {
//             "Fail": {
//                 "ex": "%s",
//                 "got": "%s",
//                 "input": "%s"
//             }
//         }
// }
// {
//         "status": "Cooked",
//         "info": {
//             "Cooked": {
//                 "error": "%s"
//             }
//         }
// }
// {
//         "status": "Pass",
//         "info": {
//             "Pass": {
//                 "execution_time": "%s",
//                 "average_time": "%s",
//                 "Pass": "%s"
//             }
//         }
// }

type ResponseStatus string
const (
	URCodeErrorLOL_T ResponseStatus = "URCodeErrorLOL"
	Fail_T = "Fail"
	Cooked_T = "Cooked"
	Pass_T = "Pass"
)

type URCodeErrorLOL struct {
	Error string `json:"error"`
}

type Fail struct {
	Ex string `json:"ex"`
	Got string `json:"got"`
	Input string `json:"input"`
}

type Cooked struct {
	Error string `json:"error"`
}

type PassInfo struct {
	Expected string  `json:"expected"`
	Got string 			 `json:"got"`
	Input string 	   `json:"input"`
	MS string 			 `json:"ms"`
}

type Pass struct {
	ExecutionTime string `json:"execution_time"`
	AverageTime string 	 `json:"average_time"`
	Pass []PassInfo      `json:"pass"`
}

type ResponsePartial struct {
	Status ResponseStatus `json:"status"`
	Info map[ResponseStatus] json.RawMessage `json:"info"`
}

type Response struct {
	Status ResponseStatus
	Info map[ResponseStatus]any
}

type Response_URCodeErrorLOL struct {
	Status ResponseStatus
	Info map[ResponseStatus]URCodeErrorLOL
}

type Response_Fail struct {
	Status ResponseStatus
	Info map[ResponseStatus]URCodeErrorLOL
}

type Response_Cooked struct {
	Status ResponseStatus
	Info map[ResponseStatus]URCodeErrorLOL
}

type Response_PasPass struct {
	Status ResponseStatus
	Info map[ResponseStatus]URCodeErrorLOL
}
