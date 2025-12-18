package database;

import (
	"log"
	"context"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type D = bson.D
type M = bson.M
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

func NewID() primitive.ObjectID {
	return primitive.NewObjectID()
}

func NewIDFromHex(hex string) (primitive.ObjectID, error){
	return primitive.ObjectIDFromHex(hex)
}

func FindOneDocument(db *Database, database, collection string, filter any, result any) error {
	coll := db.GetCollection(database, collection)
	res := coll.FindOne(context.TODO(), filter).Decode(result)
	return res;
}

func FindAllDocuments(db *Database, database, collection string, filter any, results any) error {
	coll := db.GetCollection(database, collection)
	cursor, err := coll.Find(context.TODO(), bson.M{})
	defer cursor.Close(context.Background())
	if err != nil {
		return err;
	}

	return cursor.All(context.TODO(), results)
}
