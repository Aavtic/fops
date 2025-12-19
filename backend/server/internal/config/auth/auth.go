package auth

import (
    "log"
		"os"

    "github.com/joho/godotenv"
)

type AuthConfig struct {
	SECRET string
}

func LoadAuthConfig() AuthConfig {
	err := godotenv.Load()

	if _, exist:= os.LookupEnv("SECRET_KEY"); !exist {
		log.Fatalf("Value not present in env: %s", "SECRET_KEY")
	}

  if err != nil {
    log.Fatal("Error loading .env file")
  }
  secretKey := os.Getenv("SECRET_KEY")
	return AuthConfig {
		SECRET: secretKey,
	}
}
