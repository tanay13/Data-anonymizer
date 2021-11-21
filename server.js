const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
var netanos = require("./Netanos.js");
const pdf = require("pdf-parse");

const app = express();

app.use(fileUpload());

//upload endpoint

app.post("/upload", (req, res) => {
  if (req.files == null)
    return res.status(400).json({
      msg: "No file was uploaded",
    });

  const file = req.files.file;
  file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.get("/preview/:filename/:algo", (req, res) => {
  var filename = req.params.filename;
  var algo = req.params.algo;

  var entities = {
    person: true,
    organization: true,
    currency: true,
    date: true,
    location: true,
    pronoun: true,
    numeric: true,
    other: true,
  };

  let dataBuffer = fs.readFileSync(`./client/public/uploads/${filename}`);

  var input;
  var dataOutput;

  pdf(dataBuffer).then(function (data) {
    input = "" + data.text;
    if (algo === "NEBR") {
      netanos.ner(input, entities, function (output) {
        dataOutput = "" + output;

        res.json({
          dataOutput,
        });
      });
    }
    if (algo === "CPA") {
      netanos.anon(input, entities, function (output) {
        dataOutput = "" + output;

        res.json({
          dataOutput,
        });
      });
    }
    if (algo === "NCPA") {
      dataOutput = "" + netanos.noncontext(input);

      res.json({
        dataOutput,
      });
    }
    if (algo === "CNCPA") {
      netanos.combined(input, entities, function (output) {
        dataOutput = "" + output;

        res.json({
          dataOutput,
        });
      });
    }
  });
});

app.listen(5000, () => {
  console.log("Server running");
});
