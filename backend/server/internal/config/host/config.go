package host

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)


type (
	HostConfig struct {
		HostIP   string
		HostPort int
	}
)

func LoadHostConfig() HostConfig {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	if _, exist:= os.LookupEnv("HOST"); !exist {
		log.Fatalf("Value not present in env: %s", "HOST")
	}

	if _, exist:= os.LookupEnv("PORT"); !exist {
		log.Fatalf("Value not present in env: %s", "PORT")
	}


  host := os.Getenv("HOST")
  port, err := strconv.ParseInt(os.Getenv("PORT"), 10, 64)

	if err != nil {
		log.Fatal("PORT is not vaild int, port: ", port)
	}

	return HostConfig {
		HostIP: host,
		HostPort: int(port),
	}
}
