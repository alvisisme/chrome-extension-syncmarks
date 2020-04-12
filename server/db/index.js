const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const config = require("../config");

const connect = () => {
  return new Promise((resolve, reject) => {
    const url = config.getMongoUrl();
    MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
      if (error) {
        reject(error);
      } else {
        resolve(client);
      }
    });
  });
};

exports.appendNewRecord = async (data) => {
  const client = await connect();
  const db = client.db(config.getMongoDB());
  const collection = db.collection("bookmarks");

  return new Promise((resolve, reject) => {
    collection.insertOne(
      {
        insertTime: Date.now(),
        bookmarks: data,
      },
      function (err, result) {
        assert.equal(err, null);
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

exports.getLatestRecord = async () => {
  const client = await connect();
  const db = client.db(config.getMongoDB());
  const collection = db.collection("bookmarks");
  return new Promise((resolve, reject) => {
    resolve([]);
    collection.aggregate({
      $group: { _id: '$insertTime' }
    }, {}, function(error, cursor) {
      console.log('get latest')
      assert.equal(err, null);
      if (error) {
        reject(error)
      } else {
        cursor.toArray(function(err, documents) {
          console.log(documents)
          callback(documents);
        });
      }
    });
  });
};
