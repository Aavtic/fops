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
	_ = godotenv.Load()

	if _, exist:= os.LookupEnv("SECRET_KEY"); !exist {
		log.Fatalf("Value not present in env: %s", "SECRET_KEY")
	}

  secretKey := os.Getenv("SECRET_KEY")
	return AuthConfig {
		SECRET: secretKey,
	}
}
