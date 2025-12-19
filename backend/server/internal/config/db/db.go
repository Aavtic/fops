package db

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type DBConfig struct {
	Database           string
	ProblemsCollection string
}

func LoadDBConfig() DBConfig {
	err := godotenv.Load()

	if _, exist := os.LookupEnv("MONGO_DATABASE"); !exist {
		log.Fatalf("Value not present in env: %s", "MONGO_DATABASE")
	}

	if _, exist := os.LookupEnv("PROBLEMS_COLLECTION"); !exist {
		log.Fatalf("Value not present in env: %s", "PROBLEMS_COLLECTION")
	}

	if err != nil {
		log.Fatal("Error loading .env file")
	}
	database := os.Getenv("MONGO_DATABASE")
	problems_collection := os.Getenv("PROBLEMS_COLLECTION")
	return DBConfig{
		Database:           database,
		ProblemsCollection: problems_collection,
	}
}
