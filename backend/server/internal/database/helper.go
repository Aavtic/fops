package database

import "github.com/aavtic/fops/internal/database/models"


type FilteredProblemData struct {
	ProblemId string `json:"uid"`
	Title string `json:"title"`
	TitleSlug string `json:"title_slug"`
	Description string `json:"description"`
}

func FilterProblemData(data []models.DBProblemType) []FilteredProblemData {
	var result []FilteredProblemData

	for _, problem := range data {
		filtered := FilteredProblemData {
			ProblemId:   problem.ProblemId,
			Title:		   problem.Title,
			TitleSlug: 	 problem.TitleSlug,
			Description: problem.Description,
		}
		result = append(result, filtered)
	}

	return result
}
