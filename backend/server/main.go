package main;

import (
	"github.com/aavtic/fops/internal/server"
	"github.com/aavtic/fops/internal/config"
)

func main() {
	config := config.NewConfig()
	server := server.NewServer(config);
	server.Run()
}
