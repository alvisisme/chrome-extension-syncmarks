// const MongoClient = require('mongodb').MongoClient
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const crypto = require('crypto');

// const DATABASE_NAME = 'bookmarksdb'
// const DATABASE_SERVER = '192.168.31.201'
// const DATABASE_PORT = 27017
// const USER = encodeURIComponent('root');
// const PASSWORD = encodeURIComponent('root123');
// const AUTHMECHANISM = 'SCRAM-SHA-1';
// const DATABASE_URL = `mongodb://${USER}:${PASSWORD}@${DATABASE_SERVER}:${DATABASE_PORT}/?authMechanism=${AUTHMECHANISM}&authSource=${DATABASE_NAME}`
// const DATABASE_URL = `mongodb://${DATABASE_SERVER}:${DATABASE_PORT}/${DATABASE_NAME}`
// const COLLECTION = 'bookmarks'

// const inertData = (db, callback) => {
//     const collection = db.collection('bookmarks')
//     let data = [{
//         id: '0',
//         title: "根书签"
//     }]
//     collection.insertMany(data, (error, result) => {
//         assert.equal(null, error)
//         assert(1, result.result.n)
//         assert(1, result.ops.length)
//         callback(result)
//     })
// }

exports.connect = () => {
  // const client = new MongoClient(DATABASE_URL)
  // client.connect((error) => {
  //     assert.equal(null, error)
  //     const db = client.db(DATABASE_NAME)
  //     console.log('connect ' + DATABASE_URL + ' successfully')
  //     inertData(db, result => {
  //         client.close()
  //     })
  // })
};

exports.save = (bookmarkArray, callback) => {
  const bookmarkStr = JSON.stringify(bookmarkArray);
  // 计算hash
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(bookmarkArray))
    .digest("base64");
  console.log(hash);
  fs.writeFile(
    path.join("database", Date.now() + ".json"),
    bookmarkStr,
    err => {
      callback(err);
    }
  );
};

exports.get = callback => {
  fs.readdir(path.join("database"), (err, files) => {
    if (err) throw err;
    let latestFile = 0;
    for (let i = 0; i < files.length; i++) {
      let filename = files[i];
      const time = filename.substr(0, filename.length - 5);
      if (time > latestFile) {
        latestFile = time;
      }
    }
    fs.readFile(
      path.join("database", latestFile + ".json"),
      "utf8",
      (error, data) => {
        callback(error, JSON.parse(data));
      }
    );
  });
};
