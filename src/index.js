const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//including in the middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8080, () => {
  console.log(`Server is running @8080`);
});
