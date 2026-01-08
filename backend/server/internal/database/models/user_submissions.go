package models

import (
	"time"
	// "go.mongodb.org/mongo-driver/bson/primitive"
)

type UserSubmissions struct {
	UserSubmissionId		string						`json:"user_submission_id" bson:"user_submission_id"`
	UserActivityId			string						`json:"user_activity_id" bson:"user_activity_id"`
	ProblemId						string						`json:"problem_id" bson:"problem_id"`
	SubmissionStatus 		string						`json:"submission_id" bson:"submission_status"`
	Date 								time.Time        	`json:"date" bson:"date"`
}
