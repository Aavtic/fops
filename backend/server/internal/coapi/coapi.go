package coapi

import (
	"fmt"
	"log"
	"errors"
	"encoding/json"
)

func GetResponseJson(judgeResponse string) (Response, error) {
	var response ResponsePartial
	err := json.Unmarshal([]byte(judgeResponse), &response)
	if err != nil {
		log.Println("here")
		return Response{}, err
	}

	log.Println("status: ", response.Status)

	responseStatus := response.Status
	switch (responseStatus) {
	case URCodeErrorLOL_T:
		return ParseURCodeErrorLOL(&response)

	case Fail_T:
		return ParseFail(&response)

	case Cooked_T:
		return ParseCooked(&response)

	case Pass_T:
		return ParsePass(&response)
	default:
		return Response{}, errors.New(fmt.Sprintf("Unknown response status found!: %s", responseStatus))
	}
}

func ParseURCodeErrorLOL(response *ResponsePartial) (Response, error) {
	var result Response
	var urcodeerrorlol URCodeErrorLOL
	info := response.Info[URCodeErrorLOL_T]
	err := json.Unmarshal([]byte(info), &urcodeerrorlol)
	result.Status = URCodeErrorLOL_T
	result.Info = make(map[ResponseStatus]any)
	result.Info[URCodeErrorLOL_T] = urcodeerrorlol
	return result, err
}

func ParseFail(response *ResponsePartial) (Response, error) {
	var result Response
	var fail Fail
	info := response.Info[Fail_T]
	err := json.Unmarshal([]byte(info), &fail)
	result.Status = Fail_T
	result.Info = make(map[ResponseStatus]any)
	result.Info[Fail_T] = fail
	return result, err
}

func ParseCooked(response *ResponsePartial) (Response, error) {
	var result Response
	var cooked Cooked
	info := response.Info[Cooked_T]
	err := json.Unmarshal([]byte(info), &cooked)
	result.Status = Cooked_T
	result.Info = make(map[ResponseStatus]any)
	result.Info[URCodeErrorLOL_T] = cooked
	return result, err
}

func ParsePass(response *ResponsePartial) (Response, error) {
	var result Response
	var pass Pass
	info := response.Info[Pass_T]
	err := json.Unmarshal([]byte(info), &pass)
	result.Status = Pass_T
	result.Info = make(map[ResponseStatus]any)
	result.Info[Pass_T] = pass
	// temp := result.Info[Pass_T].(Pass)
	// temp.Pass = make([]PassInfo, 1)
	// result.Info[Pass_T] = temp
	// result.Info[Pass_T] = pass
	return result, err
}
