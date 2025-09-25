package tests

import (
	"log"
	"context"
	"testing"
	"github.com/aavtic/fops/internal/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


const DATABASE string = "fops"
const COLLECTION string = "problems"

func _TestDB(t *testing.T) {
	db := database.Connect("mongodb://localhost:27017/")
	defer db.Disconnect()

	coll := db.GetCollection(DATABASE, COLLECTION)
	id, err := primitive.ObjectIDFromHex("68d0f79e8a845452fdacfc6c")
	if err != nil { t.Errorf("Could not generage HEX due to : %s", err); t.FailNow() }
	filter := bson.M{"_id": id}
	var result database.DBAddProblemRequestType
	err = coll.FindOne(context.TODO(), filter).Decode(result)
	if err != nil {
		t.Errorf("Could not execute FindOne due to : %s", err)
	}
}

func TestKeyValue(t *testing.T) {
	db := database.Connect("mongodb://localhost:27017/")
	defer db.Disconnect()

	coll := db.GetCollection(DATABASE, COLLECTION)
	var result database.DBAddProblemRequestType
	filter := bson.M{"title_slug": "fibonacci"}
	err := coll.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		t.Errorf("Could not find document: %s", err)
	}
	log.Println(result.Title)

	// err := database.FindOneDocument(db, DATABASE, COLLECTION, filter, result)
	// if err != nil { t.Errorf("Error: %s", err) }
	// log.Println(result)
}

func _TestDocs(t *testing.T) {
	db := database.Connect("mongodb://localhost:27017/")
	defer db.Disconnect()

	coll := db.GetCollection(DATABASE, COLLECTION)
	cursor, err := coll.Find(context.TODO(), bson.M{})
	if err != nil { t.Errorf("Could find  : %s", err); t.FailNow() }

	var results []database.DBAddProblemRequestType
	if err = cursor.All(context.TODO(), &results); err != nil {
		t.Errorf("Could not execute cursor.All due to: %s", err)
		t.FailNow()
	}
	log.Println(results)
}
