package database;

import (
	"log"
	"context"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type D = bson.D
var NO_DOCUMENTS = mongo.ErrNoDocuments

type Database struct {
	connection *mongo.Client
}

func Connect(uri string) *Database {
	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("Could not connect to mongodb server due to %s", err)
	}

	return &Database{
		client,
	}
}

func (db *Database) GetCollection(database, collection string) (*mongo.Collection) {
	return db.connection.Database(database).Collection(collection)
}

func (db *Database) InsertOne(database, collection string, document any) (error) {
	coll := db.GetCollection(database, collection)
	_, err := coll.InsertOne(context.TODO(), document)
	return err;
}

// Defer me
func (db *Database) Disconnect() {
	if err := db.connection.Disconnect(context.TODO()); err != nil {
		panic(err);
	}
}

func FindOneDocument[T any](db *Database, database, collection string, filter D, result *T) error {
	opts := options.FindOne()
	coll := db.GetCollection(database, collection)

	err := coll.FindOne(context.TODO(), filter, opts).Decode(&result)
	return err
}
