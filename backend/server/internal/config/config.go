package config

import (
	"github.com/aavtic/fops/internal/config/auth"
	"github.com/aavtic/fops/internal/config/db"
)

type Config struct {
	Auth auth.AuthConfig
	DB   db.DBConfig
}

func NewConfig() *Config {
	auth := auth.LoadAuthConfig()
	db := db.LoadDBConfig()

	return &Config {
		Auth: auth,
		DB: db,
	}
}
