// COAPI -> Code Output API
package coapi 

import (
	"encoding/json"
	"github.com/aavtic/fops/internal/database/models"
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
		InputOutput []models.InputOutput  `json:"input_output"`
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
	MS float32 `json:"ms"`
}

type Pass struct {
	ExecutionTime float32 `json:"execution_time"`
	AverageTime float32 `json:"average_time"`
	Pass []PassInfo      `json:"Pass"`
}

type ResponsePartial struct {
	Status ResponseStatus `json:"status"`
	Info map[ResponseStatus] json.RawMessage `json:"info"`
}

type Response struct {
	Status ResponseStatus `json:"status"`
	Info map[ResponseStatus]any `json:"info"`
}

type ResponseURCodeErrorLOL struct {
	Status ResponseStatus `json:"status"`
	Info map[ResponseStatus]URCodeErrorLOL `json:"info"`
}

type ResponseFail struct {
	Status ResponseStatus `json:"status"`
	Info map[ResponseStatus]Fail `json:"info"`
}

type ResponseCooked struct {
	Status ResponseStatus `json:"status"`
	Info map[ResponseStatus]Cooked `json:"info"`
}

type ResponsePass struct {
	Status ResponseStatus `json:"status"`
	Info map[ResponseStatus]Pass `json:"info"`
}

func (res *Response) IntoCookedResponse() (ResponseCooked, error) {
	var result ResponseCooked
	var cooked Cooked
	info := res.Info[Cooked_T]
	err := json.Unmarshal([]byte(info.(string)), &cooked)
	result.Status = Cooked_T
	result.Info = make(map[ResponseStatus]Cooked)
	result.Info[URCodeErrorLOL_T] = cooked
	return result, err
}


func (res *Response) IntoURCodeErrorLOLResponse() (ResponseURCodeErrorLOL, error) {
	var result ResponseURCodeErrorLOL 
	var urcodeerrorlol URCodeErrorLOL
	info := res.Info[URCodeErrorLOL_T]
	err := json.Unmarshal([]byte(info.(string)), &urcodeerrorlol)
	result.Status = URCodeErrorLOL_T
	result.Info = make(map[ResponseStatus]URCodeErrorLOL)
	result.Info[URCodeErrorLOL_T] = urcodeerrorlol
	return result, err
}

func (res *Response) IntoFailResponse() (ResponseFail, error) {
	var result ResponseFail
	var fail Fail
	info := res.Info[Fail_T]
	err := json.Unmarshal([]byte(info.(string)), &fail)
	result.Status = Fail_T
	result.Info = make(map[ResponseStatus]Fail)
	result.Info[Fail_T] = fail
	return result, err
}

func (res *Response) IntoPassResponse() (ResponsePass, error) {
	var result ResponsePass
	var pass Pass
	info := res.Info[Pass_T]
	err := json.Unmarshal([]byte(info.(string)), &pass)
	if err != nil {
		return ResponsePass{}, err
	}
	result.Status = Pass_T
	result.Info = make(map[ResponseStatus]Pass)
	result.Info[Pass_T] = pass
	temp := result.Info[Pass_T]
	temp.Pass = pass.Pass
	result.Info[Pass_T] = temp
	// result.Info[Pass_T] = pass
	return result, err
}
