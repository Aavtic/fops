package tests

import (
	"log"
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
		return
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
		return
	}
	if resp.Info[coapi.Fail_T].(coapi.Fail).Ex != "20" {
		t.Errorf("COULD NOT PARSE URCODEERRORLOL, expected %s found %v", "name 'retu10' is not defined" ,resp.Info[coapi.URCodeErrorLOL_T].(coapi.Fail).Ex)
	}

	log.Printf("\"%s\"....Passed!", resp.Status)
}

func TestPassUnmarshal(t *testing.T) {
	json_str := `
{
  "status": "Pass",
  "info": {
    "Pass": {
      "execution_time": 0.4,
      "average_time": 0.01,
      "Pass": [
        {
          "expected": "20",
          "got": "20",
          "input": "10",
          "ms": 0.01
        }
      ]
    }
  }
}
	`

	resp, err := coapi.GetResponseJson(json_str)
	if err != nil {
		t.Errorf("COULD NOT UNMARSHALL Pass due to %s", err)
		return
	}
	if resp.Info[coapi.Pass_T].(coapi.Pass).AverageTime != 0.01 {
		t.Errorf("COULD NOT PARSE URCODEERRORLOL, expected %s found %v", "name 'retu10' is not defined" ,resp.Info[coapi.Pass_T].(coapi.Pass).AverageTime)
	}

	log.Printf("\"%s\"....Passed!", resp.Status)
}
