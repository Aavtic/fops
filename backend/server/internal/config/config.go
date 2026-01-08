package config

import (
	"github.com/aavtic/fops/internal/config/auth"
	"github.com/aavtic/fops/internal/config/db"
	"github.com/aavtic/fops/internal/config/host"
)

type Config struct {
	Auth auth.AuthConfig
	DB   db.DBConfig
	Host host.HostConfig
}

func NewConfig() *Config {
	auth := auth.LoadAuthConfig()
	db := db.LoadDBConfig()
	host := host.LoadHostConfig()

	return &Config {
		Auth: auth,
		DB: db,
		Host: host,
	}
}
