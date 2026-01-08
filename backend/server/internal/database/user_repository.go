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

func (repo *UserRepository) CheckUserIdExists(id string) (bool, error) {
	return CheckDocumentExists(repo.db, repo.cfg.DB.Database, repo.cfg.DB.UsersCollection, bson.M{"user_id": id})
}

func (repo *UserRepository) GetUserById(id string, user any) error {
	return FindOneDocument(repo.db, repo.cfg.DB.Database, repo.cfg.DB.UsersCollection, bson.M{"user_id": id}, user)
}
