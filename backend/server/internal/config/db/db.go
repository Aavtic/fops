package db

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type DBConfig struct {
	Database           string
	ProblemsCollection string
	UsersCollection    string
	ConnectionString   string
}

func LoadDBConfig() DBConfig {
	err := godotenv.Load()

	if _, exist := os.LookupEnv("MONGO_DATABASE"); !exist {
		log.Fatalf("Value not present in env: %s", "MONGO_DATABASE")
	}

	if _, exist := os.LookupEnv("PROBLEMS_COLLECTION"); !exist {
		log.Fatalf("Value not present in env: %s", "PROBLEMS_COLLECTION")
	}

	if _, exist := os.LookupEnv("USERS_COLLECTION"); !exist {
		log.Fatalf("Value not present in env: %s", "PROBLEMS_COLLECTION")
	}

	if _, exist := os.LookupEnv("CONNECTION_STRING"); !exist {
		log.Fatalf("Value not present in env: %s", "CONNECTION_STRING")
	}

	if err != nil {
		log.Fatal("Error loading .env file")
	}
	database := os.Getenv("MONGO_DATABASE")
	problems_collection := os.Getenv("PROBLEMS_COLLECTION")
	users_collection := os.Getenv("USERS_COLLECTION")
	connection_string := os.Getenv("CONNECTION_STRING")

	return DBConfig{
		Database:           database,
		ProblemsCollection: problems_collection,
		UsersCollection: 		users_collection,
		ConnectionString: 	connection_string,
	}
}
