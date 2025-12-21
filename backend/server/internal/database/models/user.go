package models

import (
	"time"
	// "go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	UserID 			 string 						`json:"user_id" bson:"user_id"`
	Username     string             `json:"username" bson:"username"`
	PasswordHash string             `json:"password_hash" bson:"password_hash"`
	Email        string             `json:"email" bson:"email"`
	CreatedAt    time.Time          `json:"created_at" bson:"created_at"`
	ModifiedAt   time.Time          `json:"modified_at" bson:"modified_at"`
	DeletedAt    *time.Time         `json:"deleted_at,omitempty" bson:"deleted_at,omitempty"`
}

