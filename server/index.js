const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');
const port = 3000;

const SUCCESS_CODE = 0


const db  = require('./db')
db.connect()

app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.json({
    code: SUCCESS_CODE,
    data: {
      version: '0.1'
    }
  })
})

app.get('/bookmarks', function (req, res) {
  db.get((error, bookmarkArray) => {
    if (error) throw error
    res.json({
      code: SUCCESS_CODE,
      data: bookmarkArray
    })
  })
})

app.post('/bookmarks', function (req, res) {
  const bookmarkArray = req.body
  db.save(bookmarkArray, err => {
    if (err) throw err
  })
  res.json({
    code: SUCCESS_CODE
  })
})

app.listen(port, () => { console.log("server is running at port " +  port) })
