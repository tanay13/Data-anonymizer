//java -mx1000m -cp "./stanford-ner.jar:lib/*" edu.stanford.nlp.ie.NERServer  -loadClassifier classifiers/english.muc.7class.distsim.crf.ser.gz -port 8080 -outputFormat inlineXML

// var netanos = require('netanos');
var netanos = require("./Netanos.js");
var input =
  "Max and Ben spent more than 1000 hours on writing the software. They started in August 2016 in Amsterdam.";

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

netanos.anon(input, entities, function (output) {
  console.log(output);
});

netanos.ner(input, entities, function (output) {
  console.log(output);
});

console.log(netanos.noncontext(input));

netanos.combined(input, entities, function (output) {
  console.log(output);
});
