import ajv from "ajv";
import fetch from "isomorphic-fetch";
import { Promise } from "es6-promise";
import uriTemplates from "uri-templates";
import { Injector } from "infuse.js";
const container = new Injector();

// add external modules to DI container
(
    items => Object.keys(items)
        .forEach(key => container.mapValue(key, items[key]))
)({
    ajv,
    fetch,
    Promise,
    uriTemplates
});

// Load our stuff in
[
    "assertingInputOK",
    "composeRequest",
    "escapeUrl",
    "expandSchema",
    "firingRequest",
    "flow",
    "jsonSchemaRequest",
    "matchLink",
    "resolveDataForInspection",
    "resolveDataForTransmission",
    "resolveUrl",
    "schemaFetcher",
    "assertingResponseOK"
]
    .map(module => require("lib/" + module).injection)
    .forEach(injection => injection(container));

// infuse!
export default container.getValue("JsonSchemaRequest");

// @TODONE:20 .gitignore - for .imdone, node_modules, etc.
// @TODONE:0 Remove dependency on $http - see https://github.com/github/fetch#post-json
// @TODONE:10 Compile to ES5
// @TODO:20 Update README.md to describe the project
// @TODONE:30 Add tests
// @TODO:40 Publish to npm
