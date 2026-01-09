package models

import (
	"time"
	// "go.mongodb.org/mongo-driver/bson/primitive"
)

type UserActivity struct {
	UserActivityId 			string						`json:"user_activity_id" bson:"user_activity_id"`
	UserID 			 				string 						`json:"user_id" bson:"user_id"`
	UserRank						string 						`json:"user_rank" bson:"user_rank"`
	UserScore						uint64						`json:"user_score" bson:"user_score"`
	UserGlobalRank			float32 					`json:"user_global_rank" bson:"user_global_rank"`
	UserSolvedProblems 	uint64 						`json:"user_solved_problems" bson:"user_solved_problems"`
	CreatedAt    			 	time.Time         `json:"created_at" bson:"created_at"`
}
