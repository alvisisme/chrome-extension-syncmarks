const express = require("express");
const router = express.Router();
const db = require('../db')
const API_VERSION = "1.0.0";
const SUCCESS_CODE = 20000;

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function (req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});

router.get("/version", (req, res) => {
  res.json({
    code: SUCCESS_CODE,
    message: "OK",
    data: API_VERSION,
  });
});

router.get("/bookmark", async (req, res) => {
  const data = await db.getLastBookmarks()
  console.log('get last bookmark ' + data.bookmarks.length)
  console.log(JSON.stringify(data))
  res.json({
    code: SUCCESS_CODE,
    message: "OK",
    data: data.bookmarks,
  });
});

router.post("/bookmark", async (req, res) => {
  // db.appendNewRecord(req.body.bookmarks);
  const data = req.body.bookmarks
  console.log('save data')
  console.log(data)
  await db.appendBookmarks(data)
  res.json({
    code: SUCCESS_CODE,
    message: "OK",
  });
});

module.exports = router;
