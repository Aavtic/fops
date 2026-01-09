package user

import (
	"log"
	"net/http"
	"slices"

	"github.com/aavtic/fops/internal/database"
	"github.com/aavtic/fops/internal/database/models"
	"github.com/aavtic/fops/internal/config"
	"github.com/aavtic/fops/internal/responses"

	"github.com/gin-gonic/gin"
)


type UserHandler struct {
	cfg *config.Config
}

func NewUserHandler(cfg *config.Config) UserHandler {
	return UserHandler {
		cfg: cfg,
	}
}


func (uh *UserHandler) GetUserDetails(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRepo := database.NewUserRepository(db, uh.cfg);
		activityRepo := database.NewUserActivityRepository(db, uh.cfg)
		submissionRepo := database.NewUserSubmissionsRepository(db, uh.cfg)
		problemsRepo := database.NewProblemRepository(db, uh.cfg)


		user_id := c.Params.ByName("user_id")
		if exists, err := userRepo.CheckUserIdExists(user_id); err != nil || !exists {
			c.Status(http.StatusNotFound)
			return
		}

		var user models.User;
		err := userRepo.GetUserById(user_id, &user)
		if err != nil {
			c.Status(http.StatusInternalServerError)
			return
		}

		exists, err := activityRepo.CheckActivityExists(user_id)
		if err != nil {
			log.Println("ERROR: Could not check if activity exists due to:", err)
			c.Status(http.StatusInternalServerError)
			return
		}

		if !exists {
			var response = responses.UserDetailsResponse{
				Username:		user.Username,
				UserRank: 	"Rookie",
				UserScore: 	0,
				UserGlobalRank: 0,
				UserSolvedProblems: 0,
				SolvedProblemsList: []responses.ProblemBrief{},
			}
			c.JSON(http.StatusOK, response)
			return
		}

		var user_activity models.UserActivity
		err = activityRepo.GetUserActivityById(user_id, &user_activity)
		if err != nil {
			log.Println("ERROR: Could not user activity due to:", err)
			c.Status(http.StatusInternalServerError)
			return
		}

		var submissions []models.UserSubmissions
		err = submissionRepo.GetUserSubmissionsById(user_activity.UserActivityId, &submissions)
		if err != nil {
			log.Println("ERROR: Could not get user submissions due to:", err)
			c.Status(http.StatusInternalServerError)
			return
		}

		var problem_ids =  make([]string, 1)
		for _, submission := range submissions {
			problem_ids = append(problem_ids, submission.ProblemId)
		}

		var problems []models.DBAddProblemRequestType
		problemsRepo.GetProblemsByIds(problem_ids, &problems)

		solved_problems_list := intoProblemBrief(submissions, problems) 

		var response = responses.UserDetailsResponse{
			Username:		user.Username,
			UserRank: 	user_activity.UserRank,
			UserScore: 	user_activity.UserScore,
			UserGlobalRank: user_activity.UserGlobalRank,
			UserSolvedProblems: user_activity.UserSolvedProblems,
			SolvedProblemsList: solved_problems_list,
		}

		c.JSON(http.StatusOK, response)
	}
}

func intoProblemBrief(submissions []models.UserSubmissions, problems []models.DBAddProblemRequestType) []responses.ProblemBrief {
	var result = make([]responses.ProblemBrief, 0)
	var problems_map = make(map[string]models.DBAddProblemRequestType)

	for _, problem := range problems {
		problems_map[problem.ProblemId] = problem
	}

	for _, submission := range submissions {
		problem_title := problems_map[submission.ProblemId].Title
		title_slug := problems_map[submission.ProblemId].TitleSlug

		result = append(result, responses.ProblemBrief {
			Title: problem_title,
			TitleSlug: title_slug,
			Status: submission.SubmissionStatus,
			Date: submission.Date, 
		})
	}

	// Time wise order Order
	slices.Reverse(result)
	return result
}
