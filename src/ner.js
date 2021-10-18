const ner = require('ner');
var Promise = require('promise');
var Compromise = null;
var Util = null;
var NamedEntityReplacement = null;
var Partial = null;
var Logs = null;


function NER() {
    throw new Error('NER is a static class!');
}

/**
 * Extracts all entities from the text within the given text file.
 *
 * @param {String} file The name of the given file name
 */
NER.get_entities = function (string_input, type, limitations) {
    var promise = new Promise(function (resolve, reject) {
        ner.get({
            port: 8080,
            host: 'localhost'
        }, string_input, function (err, res) {
            if (err) {
                _Logs().write_error("Java server offline!");

                reject(err);
            } else {
                resolve(NER.replace_entities(NER.as_set(res.entities), string_input, type, limitations));
            }
        });
    });

    _Partial().reset();
    return promise;
};


/**
 * Converts the entity object to a set (math.).
 *
 * @param {Object} entities Found entities in given text
 * @returns {{ORGANIZATION: *, LOCATION: *}}
 */
NER.as_set = function (entities) {
    var locations = entities['LOCATION'];
    var organizations = entities['ORGANIZATION'];

    if (organizations && locations) {
        for (var i = 0; i < organizations.length; i++) {
            var index = locations.indexOf(organizations[i]);

            if (index > -1) {
                entities['ORGANIZATION'].splice(organizations.indexOf(organizations[i]), 1);
            }
        }
    }

    return {
        "ORGANIZATION": entities['ORGANIZATION'],
        "LOCATION": entities['LOCATION'],
        "PERSON": entities['PERSON'],
        "MONEY": entities['MONEY'],
        "DATE": NER.replace_white_spaces(entities['DATE']),
    };

};

NER.replace_white_spaces = function (entities) {
    if (entities) {
        for (var i = 0; i < entities.length; i++) {
            entities[i] = entities[i].replace(' ,', ',');
        }
    }

    return entities;
};

/**
 * Checks whether the given string contains a special character and returns this character if true, false otherwise.
 *
 * @param {String} element The considered string
 * @returns {*}
 */
NER.get_extension = function (element) {
    var punctuation = ['[', '.', ',', '/', '#', '!', '$', '%', '&', '*', ';', ':', '{', '}', '=', '-', '_', '`', '~', '(', ')', ']', '?'];

    for (var i = 0; i < punctuation.length; i++) {
        if (element.indexOf(punctuation[i]) > -1) {
            return punctuation[i];
        }
    }

    return false;
};

/**
 * Normalizes the given input.
 *
 * @param {String} stringinput The string to be adjusted
 * @returns {string}
 */
NER.adjust_term = function (stringinput) {
    var punctuation = ['[', '.', ',', '/', '#', '!', '$', '%', '&', '*', ';', ':', '{', '}', '=', '-', '_', '`', '~', '(', ')', ']', '?'];
    var last_char = stringinput[stringinput.length - 1];

    if (_Util().ident_inArray(last_char, punctuation)) {
        return stringinput.substring(0, stringinput.length - 1).toLowerCase();
    } else {
        return stringinput.toLowerCase();
    }

};

NER.replace_pronouns = function (data, limitations) {
    if (limitations.pronoun) {
        data = data.replace(/ he | she /gi, " [HE/SHE] ");
        data = data.replace(/\.he |\.she /gi, ". [HE/SHE] ");
        data = data.replace(/ his | her /gi, " [HIS/HER] ");
        data = data.replace(/\.his |\.her /gi, ". [HIS/HER] ");
        data = data.replace(/ him | her /gi, " [HIM/HER] ");
        data = data.replace(/\.him |\.her /gi, ". [HIM/HER] ");
    }

    return data;
};

/**
 * Replaces all the recognised entities within a given text.
 *
 * @param {String} entities The recognised entities
 */
NER.replace_entities = function (entities, data, type, limitations) {
    var organizations = [],
        locations = [],
        persons = [],
        dates = [],
        entity_arr = [],
        replaced = [],
        replacements = [],
        entity_regex,
        data = NER.replace_pronouns(data, limitations),
        first = data,
        res;

    for (var property in entities) {
        if (entities[property]) {
            for (var i = 0; i < entities[property].length; i++) {
                var entity = entities[property][i],
                    replacement = null;

                if (property == 'MONEY' && limitations.currency) {
                    entity = NER.adjust_currency(entity);
                }
                if (type == 1) {
                    replacement = _Util().get_term_beginning(entity) + "XXX" + _Util().get_term_terminator(entity);
                } else {
                    replacement = NER.get_replacement(property, entity, type, replaced);

                    if (property == 'ORGANIZATION' && limitations.organization) {
                        organizations.push(replacement);
                        replaced.push(replacement);
                    } else if (property == 'LOCATION' && limitations.location) {
                        locations.push(replacement);
                        replaced.push(replacement);
                    } else if (property == 'PERSON' && limitations.person) {
                        replaced.push(replacement);
                        res = _Compromise().smart_name_rep(data, entity, replacement);
                        data = res.data;
                        if (res.entities) {
                            for (var i = 0; i < res.entities.length; i++) {
                                entity_arr.push(res.entities[i]);
                            }
                            persons.push(res.re_last);
                        }
                        persons.push(replacement);
                    } else if (property == "DATE" && limitations.date) {
                        replaced.push(replacement);
                        dates.push(replacement);
                    }
                }

                if (data.indexOf(entity) != -1 && NER.property_valid(property, limitations)) {
                    replacements.push(
                        {
                            index: data.indexOf(entity),
                            original: _Util().remove_term_terminator(entity),
                            entity: property
                        }
                    );

                    entity_regex = new RegExp(entity, 'g');
                    data = data.replace(entity_regex, replacement);
                }

            }
        }
    }

    replacements = NER.filter_replacements(replacements, limitations);

    if (type == 2) {
        return _Partial().partial_replacement(first, data, replacements, limitations, entities);
    } else {
        var res = _Compromise().fine_tuning(data, organizations, locations, persons, dates, replaced, type, limitations);
        var output = res.replaced;

        for (var i = 0; i < res.entities.length; i++) {
            entity_arr.push(res.entities[i]);
        }

        if (type == 0 && limitations.currency) {
            output = NER.replace_currencies(output);
        }

        return output;
    }
};

NER.property_valid = function (property, limitations) {
    switch (property) {
        case "LOCATION":
            if (limitations.location) {
                return true;
            }
            return false;
        case "PERSON":
            if (limitations.person) {
                return true;
            }
            return false;
        case "ORGANIZATION":
            if (limitations.organization) {
                return true;
            }
            return false;
        case "DATE":
            if (limitations.date) {
                return true;
            }
            return false;
        case "MONEY":
            if (limitations.currency) {
                return true;
            }
            return false;
        default:
            return false;
    }
}

NER.filter_replacements = function (replacements, limitations) {
    var new_replacements = []

    for (var i = 0; i < replacements.length; i++) {
        var current = replacements[i];

        switch (current.entity) {
            case "LOCATION":
                if (limitations.location) {
                    new_replacements.push(current);
                }
                break;
            case "PERSON":
                if (limitations.person) {
                    new_replacements.push(current);
                }
                break;
            case "ORGANIZATION":
                if (limitations.organization) {
                    new_replacements.push(current);
                }
                break;
            case "DATE":
                if (limitations.date) {
                    new_replacements.push(current);
                }
                break;
            case "MONEY":
                if (limitations.currency) {
                    new_replacements.push(current);
                }
                break;
            default:
                new_replacements.push(current);
        }
    }

    return new_replacements;
}

NER.replace_currencies = function (data) {
    data = data.replace(/€/g, '');
    return data.replace(/\$/g, '');
};

NER.adjust_currency = function (currency) {
    return parseFloat(currency.replace(/[^\d\.]/g, '')).toString();
};

NER.get_replacement = function (property, entity, type, replaced) {
    var replacement = _NamedEntityReplacement().ext_get_replacement(property, entity, type);

    try {
        if (_Util().ident_inArray(replacement, replaced)) {
            return _NamedEntityReplacement().get_replacement(property, entity, type, replaced);
        } else {
            return replacement;
        }
    } catch (e) {
        return replacement;
    }

};

function _Compromise() {
    if (!Compromise) {
        Compromise = require('./compromise.js');
    }

    return Compromise;
}

function _Util() {
    if (!Util) {
        Util = require("./util.js");
    }

    return Util;
}

function _NamedEntityReplacement() {
    if (!NamedEntityReplacement) {
        NamedEntityReplacement = require("./types/namedEntity.js");
    }

    return NamedEntityReplacement;
}

function _Partial() {
    if (!Partial) {
        Partial = require("./types/partial.js");
    }

    return Partial;
}


function _Logs() {
    if (!Logs) {
        Logs = require("./logs.js");
    }

    return Logs;
}


module.exports = NER;
