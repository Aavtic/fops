package coapi

import (
	"log"
	"time"
	"net/http"
	"encoding/json"

	"github.com/aavtic/fops/internal/database"
	"github.com/aavtic/fops/internal/config"
	"github.com/aavtic/fops/internal/database/models"
	"github.com/aavtic/fops/internal/coapi"
	"github.com/aavtic/fops/utils/logging"
	"github.com/aavtic/fops/internal/launcher/python-launcher"
	"github.com/aavtic/fops/utils/fs"
	"github.com/aavtic/fops/internal/env"
	"go.mongodb.org/mongo-driver/v2/bson"


	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type submissionStatus string

const (
	submissionPass submissionStatus = "pass"
	submissionFail submissionStatus  = "fail"
	submissionAttempted submissionStatus  = "attempt"
)

func (ss submissionStatus) toString() string {
	switch ss {
	case submissionPass:
		return "pass"

	case submissionFail:
		return "fail"

	case submissionAttempted:
		return "attempt"
	default:
		return "invalid"
	}
}


type CoapiHandler struct {
	cfg *config.Config
}

func NewCoapiHandler(cfg *config.Config) CoapiHandler {
	return CoapiHandler {
		cfg: cfg,
	}
}

func (ch *CoapiHandler) Test_code_handler(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		var request coapi.TestQuestionRequest
		if c.Bind(&request) == nil {
			var response models.DBProblemType
			id := request.ID
			filter := database.M{"uid": id}
			err := database.FindOneDocument(db, ch.cfg.DB.Database, ch.cfg.DB.ProblemsCollection, filter, &response)
			if err != nil {
				log.Printf("ERROR: Could not find document due to: %v\n", err)
				c.JSON(http.StatusBadRequest, gin.H{"error": "Could not find problem with that id. Please refer https://github.com/aavtic/fops"})
				return
			}

			question_template := coapi.QuestionTemplate{
				ID:           response.ProblemId,
				Title:        response.Title,
				Description:  response.Description,
				FunctionName: response.FunctionName,
				InputType:    response.InputType,
				OutputType:   response.OutputType,
				InputOutput:  response.InputOutput,
			}

			template, err := json.Marshal(question_template)
			if err != nil {
				log.Println("ERROR: Could not marshall data due to: ", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "An unexpected error occured in the server. oops..."})
				return
			}

			coapi_response_any, err := TestCode(request.Lang, request.Code, string(template))
			if err != nil {
				log.Printf("ERROR: Could not get coapi json due to %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "An unexpected error occured in the server. oops..."})
			}
			log.Printf("INFO: COAPI RESPONSE: %v", coapi_response_any)

			// Do some activity logging
			userID := c.GetString("user_id")
			subStat := intoSubmissionStatus(coapi_response_any.Status)

			TrackProgress(db, ch.cfg, userID, response.ProblemId, subStat)

			c.JSON(http.StatusOK, coapi_response_any)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing expected values in json. Please refer https://github.com/aavtic/fops"})
		}
	}
}

func TestCode(language, code, problem_template string) (coapi.Response, error) {
	_ = language
	log.Println("[+] Server up and running...")
	env_vars := env.LoadEnv()

	logging.LogAll(
		"Code storage: "+env_vars.Code_storage,
		"Output details: "+env_vars.Output_details,
		"Code templates: "+env_vars.Code_templates,
	)

	// Temp

	temp_dir, err := fs.CreateTempDir(env_vars.Code_storage, "py")
	logging.ExitIfError(err, "Could not create temp dir due to")

	code_file := temp_dir + "/main.py"
	err = fs.Create_file_and_write(code_file, code)
	if err != nil {
		log.Println("Could not create and file or write to file: ", err)
		return coapi.Response{}, err
	}

	log.Println("Written to file successfully!")

	response_str, err := pythonlauncher.Launch(temp_dir, "./output.json", problem_template)
	// TODO: LOG the error don't exit
	logging.ExitIfError(err, "Could not run Launch python program due to ")
	log.Println("INFO: JUDGE RESPONSE: ", response_str)
	response, err := coapi.GetResponseJson(response_str)
	if err != nil {
		log.Printf("ERROR: FAILED TO PARSE JUDGE RESPONSE DUE TO %v", err)
		return coapi.Response{}, err
	}

	return response, nil
}

func TrackProgress(db *database.Database, cfg *config.Config, userId, problemId string, submissionStatus submissionStatus) {
	userActivityRepo := database.NewUserActivityRepository(db, cfg)
	userSubmissionRepo := database.NewUserSubmissionsRepository(db, cfg)

	exists, err := userActivityRepo.CheckActivityExists(userId);
	if err != nil {
		log.Println("ERROR: Could not check if activity exists due to: ", err)
		return
	}

	if !exists {
		userActivity := NewUserActivity(userId)
		if submissionStatus == submissionPass {
			userActivity.UserScore = 10
			userActivity.UserSolvedProblems = 1
		}
		err = userActivityRepo.CreateUserActivity(userActivity)

		if err != nil {
			log.Printf("ERROR: Could not create user activity due to: %v\n", err)
		}

		userSub := NewUserSubmissions(userActivity.UserActivityId, problemId, submissionStatus)
		err = userSubmissionRepo.CreateUserSubmission(userSub)

		if err != nil {
			log.Printf("ERROR: Could not create user submission due to: %s", err)
			return
		}

	} else {
		// models.UserActivity
		var userActivity models.UserActivity
		err := userActivityRepo.GetUserActivityById(userId, &userActivity)
		if err != nil {
			log.Printf("ERROR: Could not get user activity due to: %v\n", err)
		}

		if submissionStatus == submissionPass {
			var submissions []models.UserSubmissions
			userSubmissionRepo.GetUserProblemSubmissions(userActivity.UserActivityId, problemId, &submissions)

			var previouslyCompleted = false
			for _, submission := range submissions {
				log.Println(submission.SubmissionStatus, submissionStatus.toString(), submission.SubmissionStatus == submissionStatus.toString())
				if submission.SubmissionStatus == submissionStatus.toString() {
					previouslyCompleted = true
					break
				}
			}

			log.Println(previouslyCompleted)

			if !previouslyCompleted {
				var usersActivities []models.UserActivity
				err := userActivityRepo.GetUsersActivity(&usersActivities)
				if err != nil {
					log.Printf("ERROR: Could not get user activity due to: %v\n", err)
				}

				var scores []uint64
				for _, activity := range usersActivities {
					scores = append(scores, activity.UserScore)
				}

				global_perc := getUserGlobalPerc(userActivity.UserScore, scores)

				filter := bson.D{{"user_id", userActivity.UserID}}
				update := bson.D{
					{"$set", bson.D{{"user_rank", "Almighty"}, {"user_global_score", global_perc}}},
					{"$inc", bson.D{{"user_score", 10}, {"user_solved_problems", 1}}},
				}
				err = userActivityRepo.UpdateUserActivity(filter, update)
				if err != nil {
					log.Printf("ERROR: Could not update user activity due to: %v\n", err)
				}
			}
		}

		submission := NewUserSubmissions(userActivity.UserActivityId, problemId, submissionStatus)
		err = userSubmissionRepo.CreateUserSubmission(submission)

		if err != nil {
			log.Printf("ERROR: Could not update user submission due to: %v\n", err)
		}
	}
}

func NewUserSubmissions(user_activity_id, prob_id string, sub_status submissionStatus) models.UserSubmissions {
	return models.UserSubmissions {
		UserSubmissionId: uuid.New().String(),
		UserActivityId: 	user_activity_id,
		ProblemId: prob_id,
		SubmissionStatus: sub_status.toString(),
		Date: time.Now().UTC(),
	}
}

func NewUserActivity(user_id string) models.UserActivity {
	return models.UserActivity {
		UserActivityId: uuid.New().String(),
		UserID: user_id,
		UserRank: "Rookie",
		UserScore: 0,
		UserGlobalRank: 0,
		UserSolvedProblems: 0,
		CreatedAt: time.Now().UTC(),
	}
}

func intoSubmissionStatus(stat coapi.ResponseStatus) submissionStatus {
	switch stat {
	case coapi.URCodeErrorLOL_T:
		return submissionFail
	case coapi.Fail_T:
		return submissionAttempted
	case coapi.Pass_T:
		return submissionPass
	default:
		return submissionFail
	}
}

func getUserGlobalPerc(user_score uint64, all_scores []uint64) float32 {
	below_me := 0
	for _, score := range all_scores {
		if score < user_score {
			below_me += 1
		}
	}

	if len(all_scores) == 0 {
		return 0
	} 

	return float32(below_me) / float32(len(all_scores)) * 100
}
