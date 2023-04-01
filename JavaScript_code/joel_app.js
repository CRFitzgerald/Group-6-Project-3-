// load the MongoDB driver
//const MongoClient = require('mongodb').MongoClient;
//import {MongoClient} from "mongodb";
// connection URL and database name
const url = 'mongodb://localhost:27017/';
const dbName = 'amazon_db';

// create a new MongoClient instance
const client = new mongodb.MongoClient(url, { useUnifiedTopology: true });

// connect to the MongoDB server
client.connect((err) => {
    if (err) throw err;

// connect to the MongoDB server
//MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
//mongo.connect(url, { useUnifiedTopology: true }, (err, client) => {
//  if (err) throw err;
  
  // specify the database and collection
  const db = client.db(dbName);
  const collection = db.collection('books_collection');

  // find all documents in the collection and extract the rating and review_count for each title
  collection.find({}).project({ title: 1, rating: 1, review_count: 1 }).toArray((err, docs) => {
    if (err) throw err;

    // print the results
    console.log(docs);

    // close the MongoDB client
    client.close();
  });
});
