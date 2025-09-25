package tests

import (
	"testing"
	"github.com/aavtic/fops/internal/coapi"
)

func TestURCodeErrorLOLUnmarshal(t *testing.T) {
	json_str := `
	{
    "status": "URCodeErrorLOL",
    "info":
        {
            "URCodeErrorLOL": {
                "error": "name 'retu10' is not defined"
            }
        }
	}`

	resp, err := coapi.GetResponseJson(json_str)
	if err != nil {
		t.Errorf("COULD NOT UNMARSHALL URCodeErrorLOL due to %s", err)
	}
	if resp.Info[coapi.URCodeErrorLOL_T].(coapi.URCodeErrorLOL).Error != "name 'retu10' is not defined" {
		t.Errorf("COULD NOT PARSE URCODEERRORLOL, expected %s found %v", "name 'retu10' is not defined" ,resp.Info[coapi.URCodeErrorLOL_T].(coapi.URCodeErrorLOL).Error)
	}
}

func TestFailUnmarshal(t *testing.T) {
	json_str := `
	{
        "status": "Fail",
        "info": {
            "Fail": {
                "ex": "20",
                "got": "10",
                "input": "10"
            }
        }
}`

	resp, err := coapi.GetResponseJson(json_str)
	if err != nil {
		t.Errorf("COULD NOT UNMARSHALL Fail due to %s", err)
	}
	if resp.Info[coapi.Fail_T].(coapi.Fail).Ex != "20" {
		t.Errorf("COULD NOT PARSE URCODEERRORLOL, expected %s found %v", "name 'retu10' is not defined" ,resp.Info[coapi.URCodeErrorLOL_T].(coapi.Fail).Ex)
	}
}

func TestPassUnmarshal(t *testing.T) {
	json_str := `
	{
        "status": "Pass",
        "info": {
            "Pass": {
                "execution_time": "2.9",
                "average_time": "0.02",
                "Pass": "[{'expected': 20, 'got': 20, 'input': 10, 'ms': 0.02}]"
            }
        }
}`

	resp, err := coapi.GetResponseJson(json_str)
	if err != nil {
		t.Errorf("COULD NOT UNMARSHALL Pass due to %s", err)
	}
	if resp.Info[coapi.Pass_T].(coapi.Pass).AverageTime != "0.02" {
		t.Errorf("COULD NOT PARSE URCODEERRORLOL, expected %s found %v", "name 'retu10' is not defined" ,resp.Info[coapi.Pass_T].(coapi.Pass).AverageTime)
	}
}
