"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ajv = require("ajv");

var _ajv2 = _interopRequireDefault(_ajv);

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _es6Promise = require("es6-promise");

var _uriTemplates = require("uri-templates");

var _uriTemplates2 = _interopRequireDefault(_uriTemplates);

var _infuse = require("infuse.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var container = new _infuse.Injector();

// add external modules to DI container
(function (items) {
    return Object.keys(items).forEach(function (key) {
        return container.mapValue(key, items[key]);
    });
})({
    ajv: _ajv2.default,
    fetch: _isomorphicFetch2.default,
    Promise: _es6Promise.Promise,
    uriTemplates: _uriTemplates2.default
});

// Load our stuff in
["assertingInputOK", "composeRequest", "escapeUrl", "expandSchema", "firingRequest", "flow", "jsonSchemaRequest", "matchLink", "resolveDataForInspection", "resolveDataForTransmission", "resolveUrl", "schemaFetcher", "assertingResponseOK"].map(function (module) {
    return require("lib/" + module).injection;
}).forEach(function (injection) {
    return injection(container);
});

// infuse!
exports.default = container.getValue("JsonSchemaRequest");

// @TODONE:20 .gitignore - for .imdone, node_modules, etc.
// @TODONE:0 Remove dependency on $http - see https://github.com/github/fetch#post-json
// @TODONE:10 Compile to ES5
// @TODO:20 Update README.md to describe the project
// @TODONE:30 Add tests
// @TODO:40 Publish to npm
