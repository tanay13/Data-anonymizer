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

    let dataBuffer = fs.readFileSync(`./client/public/uploads/${file.name}`);

    var input;

    pdf(dataBuffer).then(function (data) {
      console.log(data.text);
      input = "" + data.text;
      netanos.ner(input, entities, function (output) {
        console.log(output);
      });
    });
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.listen(5000, () => {
  console.log("Server running");
});
