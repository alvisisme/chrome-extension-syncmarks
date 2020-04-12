const express = require("express");
const cors = require("cors");
const app = express();
const routerV1 = require("./router/v1");
const port = 3000;

app.use(cors());
app.use(express.json({
  limit: '50mb'
})); // for parsing application/json
app.use(express.urlencoded({ 
  limit: '50mb',
  parameterLimit: 10000,
  extended: true
})); // for parsing application/x-www-form-urlencoded

app.use("/v1", routerV1);

app.listen(port, () => {
  console.log("server is running at port " + port);
});
