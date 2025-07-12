package logging

import (
	"log"
)

func LogAll(logMsgs... string) {
	for msg := range logMsgs {
		log.Println(msg)
	}
}

func ExitIfError(err error, msg string) {
	if err != nil {
		log.Fatal(msg, ": ", err)
	}
}
