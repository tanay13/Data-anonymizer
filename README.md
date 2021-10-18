[![DOI](https://zenodo.org/badge/86087510.svg)](https://zenodo.org/badge/latestdoi/86087510)

# Summary

Netanos (**N**amed **E**ntity-based **T**ext **AN**onymization for **O**pen **S**cience) is a natural language processing software that anonymizes texts by identifying and replacing named entities. The key feature of NETANOS is that the anonymization preserves critical context that allows for secondary linguistic analyses on anonymized texts. 

## Installation, usage, and dependencies
NETANOS requires Stanford's Named Entity Recognizer (Finkel, Grenager, & Manning, 2005). You can download the Java distribution [here](https://nlp.stanford.edu/software/CRF-NER.shtml). Once you have it downloaded, the Stanford NER needs to be executed before NETANOS can be used. This can be done as follows (with Stanford NER running on port 8080):

- go to the directory `netanos/libs/stanford-ner/` and run the following command (in Terminal) after unzipping the downloaded Stanford NER file:

```bash
$ java -mx1000m -cp "stanford-ner.jar:lib/*" edu.stanford.nlp.ie.NERServer  -loadClassifier classifiers/english.muc.7class.distsim.crf.ser.gz -port 8080 -outputFormat inlineXML
```

- once you started the Java-Server, keep it running and navigate to the directory `./netanos` to run your anonymization script with `node run.js`
- after you've finished, you can end the server with `crtl + c`



Furthermore, NETANOS relies on the following node.js-dependencies:

* **ner** (https://github.com/niksrc/ner)
* **promise** (https://github.com/then/promise)




### Installing NETANOS (after Stanford's NER is downloaded)

You can use `npm install` or compile NETANOS from source. For both installation types, make sure you've got the `Node.js` dependencies installed:

- Install the Stanford NER Java distribution (see above for the exact command)
- Open terminal and install the dependencies.

```javascript
npm install ner
npm install promise
```

#### 1. npm install

NETANOS can easily be installed via [npm](https://www.npmjs.com/package/netanos). 

```
$ npm install netanos
```

The integration is illustrated below. The anonymization function takes the input string and a callback function as arguments and returns the anonymized string via the callback.

```javascript
var netanos = require("netanos"); //note that this is different from the filepath in the from-source installation
var input = "Max and Ben spent more than 1000 hours on writing the software. They started in August 2016 in Amsterdam.";

var entities = {
  person: true,
  organization: true,
  currency: true,
  date: true,
  location: true,
  pronoun: true,
  numeric: true,
  other: true
};

netanos.ner(input, entities, function(output) {
    console.log(output);
});

/*
"Barry and Rick spent more than 997 hours on writing the software. They started in January 14 2016 in Odessa."
*/
```



#### 2. Compile from source

Alternatively, the NETANOS source-code can be integrated manually with the `Netanos.js` file as user endpoint.

1. Access `run.js` to set the input of your string.

```javascript
var netanos = require("./Netanos.js");
var input = "Max and Ben spent more than 1000 hours on writing the software. They started in August 2016 in Amsterdam.";

var entities = {
  person: true,
  organization: true,
  currency: true,
  date: true,
  location: true,
  pronoun: true,
  numeric: true,
  other: true
};

netanos.ner(input, entities, function(output) {
    console.log(output);
});

/*
"Barry and Rick spent more than 997 hours on writing the software. They started in January 14 2016 in Odessa."
*/
```

2. In Terminal, run the `run.js` script:

```
node run.js
```



### Tests with `npm test`

Once the Java server is running, you can test the functionality of NETANOS with `npm test`. To do this, make sure you've got the JavaScript test framework [mocha.js](https://mochajs.org) installed (use `npm install mocha`).

The tests will run for all four core methods of NETANOS.



## Documentation

NETANOS offers the following functionality:

1. **Context-preserving anonymization** (`netanos.anon`): each identified entity is replaced with an indexed generic replacement of the entity type (e.g. Peter -> [PERSON_1], Chicago -> [LOCATION\_1]). The object `entities` allows you to specify the entities you would like to have included in your anonymization.

```javascript
var input = "Max and Ben spent more than 1000 hours on writing the software. They started in August 2016 in Amsterdam.";

var entities = {
  person: true,
  organization: true,
  currency: true,
  date: true,
  location: true,
  pronoun: true,
  numeric: true,
  other: true
};

netanos.anon(input, entities, function(output) {
    console.log(output);
});

/*
"[PERSON_1] and [PERSON_2] spent more than [DATE/TIME_1] on writing the software. They started in [DATE/TIME_2] in [LOCATION_1]."
*/
```
2. **Named entity-based replacement** (`netanos.ner`): each identified entity will be replaced with a different entity of the same type (e.g. Peter -> Alfred, Chicago -> London). The object `entities` allows you to specify the entities you would like to have included in your anonymization.

```javascript
var input = "Max and Ben spent more than 1000 hours on writing the software. They started in August 2016 in Amsterdam.";

var entities = {
  person: false,
  organization: true,
  currency: true,
  date: true,
  location: true,
  pronoun: true,
  numeric: true,
  other: true
};

netanos.ner(input, entities, function(output) {
    console.log(output);
});

/*
“Max and Ben spent more than 997 hours on writing the software. They started in January 14 2016 in Odessa.”
*/
```
3. **Non-context preserving anonymization** (`netanos.noncontext`): this approach is not based on named entities and replaces every word starting with a capital letter and every numeric value with "XXX". **Note that entity-specific anonymization is not compatible with this type**. 

```javascript
var input = "Max and Ben spent more than 1000 hours on writing the software. They started in August 2016 in Amsterdam.";

/*
Note that the non-context preserving replacement is not asynchronous as it does not rely on the named entitiy recognition.
*/
var anonymized = netanos.noncontext(input);

console.log(anonymized);

/*
“XXX and XXX spent more than XXX hours on writing the software. XXX started in XXX XXX in XXX.”
*/
```
4. **Combined, non-context preserving anonymization** (`netanos.combined`): the non-context preserving replacement and the named entity-based replacement are combined such that each word starting with a capital letter, each numeric value and all identified named entities are replaced with "XXX". The object `entities` allows you to specify the entities you would like to have included in your anonymization.

```javascript
var input = "Max and Ben spent more than 1000 hours on writing the software. They started in August 2016 in Amsterdam.";

var entities = {
  person: true,
  organization: true,
  currency: true,
  date: true,
  location: true,
  pronoun: true,
  numeric: true,
  other: true
};

netanos.combined(input, entities, function(output) {
  	console.log(output);
});

/*
“XXX and XXX spent more than XXX XXX on writing the software. XXX started in XXX XXX in XXX.”
*/
```



#### Contact

projectnetanos@gmail.com



## License

MIT © [Bennett Kleinberg](http://bkleinberg.net) & [Maximilian Mozes](http://mmozes.net)