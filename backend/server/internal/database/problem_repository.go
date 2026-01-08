package database;

import (
	"github.com/aavtic/fops/internal/config"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type ProblemRepository struct {
		cfg *config.Config
		db *Database
}

func NewProblemRepository(db *Database, cfg *config.Config) *ProblemRepository {
	return &ProblemRepository{
		cfg: cfg,
		db: db,
	}
}

func (pr *ProblemRepository) CreateProblem(db_json any) error {
	return InsertOne(pr.db, pr.cfg.DB.ProblemsCollection, pr.cfg.DB.ProblemsCollection, db_json)
}

func (pr *ProblemRepository) GetProblemsByIds(ids []string, result any) error {
	filter := bson.M {
		"uid": bson.M {
			"$in": ids,
		},
	}
	return FindAllDocuments(pr.db, pr.cfg.DB.Database, pr.cfg.DB.ProblemsCollection, filter, result)
}
