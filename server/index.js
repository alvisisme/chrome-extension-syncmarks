const express = require('express');
const app = express();
const port = 3000;

// const db  = require('./db')
// db.connect()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/bookmarks', function (req, res) {
    console.log('download bookmarks')
    res.json({
      id: '0',
      title: '标题'
    })
})

app.post('/bookmarks', function (req, res) {
  console.log('upload bookmarks')
  console.log(req.body)
})

app.listen(port, () => { console.log("server is running at port " +  port) })
