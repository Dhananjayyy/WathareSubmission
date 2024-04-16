const exp = require("express");
const fs = require("fs");
const cors = require("cors");

const app = exp();
app.use(cors());
app.use(exp.json());

app.get("/hello", (req, res) => {
  res.send("Hello World");
});

app.listen(9000, function () {
  console.log("server started on 9000");
});
