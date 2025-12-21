package database

import (
	"github.com/aavtic/fops/internal/config"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type UserRepository struct {
	db  *Database 
	cfg *config.Config 
}

func NewUserRepository(db *Database, cfg *config.Config) UserRepository {
	return UserRepository{
		db: db,
		cfg: cfg,
	}
}

func (repo *UserRepository) CheckEmailExists(email string) (bool, error) {
	return CheckDocumentExists(repo.db, repo.cfg.DB.Database, repo.cfg.DB.UsersCollection, bson.M{"email": email})
}
