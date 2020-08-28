const Datastore = require("nedb");

var db = new Datastore({
  filename: "data/bookmarks.db",
  autoload: true,
});

const appendBookmarks = (bookmarks) => {
  return new Promise((resolve, reject) => {
    db.insert({
      time: Date.now(),
      bookmarks,
    }, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    });
  })
};

const getLastBookmarks = () => {
  return new Promise((resolve, reject) => {
      db.find({}).sort({ time: -1}).limit(1).exec(function (err, docs) {
        if (err) {
          reject(err)
        } else {
          console.log(docs)
          if (docs.length > 0) {
            resolve(docs[0])
          } else {
            resolve()
          }
        }
      });
  })
};

module.exports = {
  appendBookmarks,
  getLastBookmarks,
};
