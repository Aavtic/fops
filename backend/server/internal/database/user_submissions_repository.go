package database

import (
	"github.com/aavtic/fops/internal/config"
	"github.com/aavtic/fops/internal/database/models"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type UserSubmissions struct {
	db  *Database 
	cfg *config.Config 
}

func NewUserSubmissionsRepository(db *Database, cfg *config.Config) UserSubmissions {
	return UserSubmissions{
		db: db,
		cfg: cfg,
	}
}

func (repo *UserSubmissions) GetUserSubmissionsById(activity_id string, submissions any) error {
	return FindAllDocuments(repo.db, repo.cfg.DB.Database, repo.cfg.DB.UserSubmissionsCollection, bson.M{"user_activity_id": activity_id}, submissions)
}

func (repo *UserSubmissions) CreateUserSubmission(user_submission models.UserSubmissions) error {
	return InsertOne(repo.db, repo.cfg.DB.Database, repo.cfg.DB.UserSubmissionsCollection, user_submission)
}
