package responses

import (
	"time"
)

type (
	UserDetailsResponse struct {
		Username		string 		`json:"username"`
		UserRank		string		`json:"user_rank"`
		UserScore		uint64		`json:"user_score"`
		UserGlobalRank uint64	`json:"user_global_score"`
		UserSolvedProblems uint64 `json:"user_solved_problems"`

		SolvedProblemsList []ProblemBrief `json:"solved_problems_list"`
	}

	ProblemBrief struct {
		Title		string 		`json:"title"`
		TitleSlug string	`json:"title_slug"`
		Date		time.Time	`json:"date"`
		Status	string		`json:"status"`
	}
)
