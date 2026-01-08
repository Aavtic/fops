package database

import (
	"github.com/aavtic/fops/internal/config"
	"github.com/aavtic/fops/internal/database/models"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type UserActivity struct {
	db  *Database 
	cfg *config.Config 
}

func NewUserActivityRepository(db *Database, cfg *config.Config) UserActivity {
	return UserActivity{
		db: db,
		cfg: cfg,
	}
}

func (repo *UserActivity) CheckActivityExists(user_id string) (bool, error) {
	return CheckDocumentExists(repo.db, repo.cfg.DB.Database, repo.cfg.DB.UserActivityCollection, bson.M{"user_id": user_id})
}

func (repo *UserActivity) GetUserActivityById(user_id string, activity any) error {
	return FindOneDocument(repo.db, repo.cfg.DB.Database, repo.cfg.DB.UserActivityCollection, bson.M{"user_id": user_id}, activity)
}

func (repo *UserActivity) CreateUserActivity(user_activity models.UserActivity) error {
	return InsertOne(repo.db, repo.cfg.DB.Database, repo.cfg.DB.UserActivityCollection, user_activity)
}

func (repo *UserActivity) UpdateUserActivity(filter, update any) error {
	return UpdateOne(repo.db, repo.cfg.DB.Database, repo.cfg.DB.UserActivityCollection, filter, update)
}
