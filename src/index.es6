import ajv from "ajv";
import deepPluck from "deep-pluck";
import deref from "deref";
import fetch from "isomorphic-fetch";
import { Promise } from "es6-promise";
import uriTemplates from "uri-templates";
import { Injector } from "infuse.js";
import FormData from "form-data";
import from from "array.from";
import jsonSchemaLoadTree from "json-schema-load-tree";
const container = new Injector();

// add external modules to DI container
(
    items => Object.keys(items)
        .forEach(key => container.mapValue(key, items[key]))
)({
    ajv,
    deepPluck,
    deref,
    fetch,
    FormData,
    from,
    jsonSchemaLoadTree,
    Promise,
    uriTemplates
});

// Load our stuff in
require("./assertingInputOK").injection(container);
require("./composeRequest").injection(container);
require("./escapeUrl").injection(container);
require("./firingRequest").injection(container);
require("./jsonSchemaRequest").injection(container);
require("./matchLink").injection(container);
require("./resolveDataForInspection").injection(container);
require("./resolveDataForTransmission").injection(container);
require("./resolveUrl").injection(container);
require("./schemaFetcher").injection(container);
require("./assertingResponseOK").injection(container);

// infuse!
export default () => container.getValue("jsonSchemaRequest");

// @TODONE:20 .gitignore - for .imdone, node_modules, etc.
// @TODONE:0 Remove dependency on $http - see https://github.com/github/fetch#post-json
// @TODONE:10 Compile to ES5
// @TODO:20 Update README.md to describe the project
// @TODONE:30 Add tests
// @TODO:40 Publish to npm
