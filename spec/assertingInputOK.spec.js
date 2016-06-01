var assertingInputOK = require("../lib/assertingInputOK").default;
var injection = require("../lib/assertingInputOK").injection;
var jsonValidationError = require("../lib/jsonValidationError").default;
var infusejs = require("infuse.js");
var ajv = require("ajv");
var utils = require("./_utils");
var PromiseSync = utils.PromiseSync;

describe("assertingInputOK", function() {
    var container;

    beforeEach(function() {
        container = new infusejs.Injector();
        container.mapValue("ajv", ajv);
        container.mapValue("Promise", PromiseSync);
        container.mapValue("JsonValidationError", jsonValidationError);
    });

    it("should be a function", function() {
        expect(assertingInputOK).toEqual(jasmine.any(Function));
    });

    it("should return a promise", function() {
        expect(assertingInputOK(ajv, jsonValidationError, PromiseSync)()).toEqual(jasmine.any(PromiseSync));
    });

    it("should reject if the input is invalid", function() {
        [
            {},
            false,
            "",
            1.4,
            {
                schemaUrl: "http://example.com",
                rel: "self",
                unexpectedKey: "oh no!"
            },
            {
                schemaUrl: "not a http url",
                rel: "self"
            },
            {
                schemaUrl: "http://example.com",
                rel: "self",
                context: false
            }
        ]
            .forEach(function(input) {
                var result = assertingInputOK(ajv, jsonValidationError, PromiseSync)(input);
                expect(result._catch).toBeDefined();
                expect(result._then).toBeUndefined();
            });
    });

    it("should mention where the invalid object was discovered", function() {
        [
            {},
            false,
            "",
            1.4,
            {
                schemaUrl: "http://example.com",
                rel: "self",
                unexpectedKey: "oh no!"
            },
            {
                schemaUrl: "not a http url",
                rel: "self"
            },
            {
                schemaUrl: "http://example.com",
                rel: "self",
                context: false
            }
        ]
            .forEach(function(input) {
                var result = assertingInputOK(ajv, jsonValidationError, PromiseSync)(input);
                expect(result._catch.message).toContain("Input");
            });
    });

    it("should resolve if the input is valid", function() {
        [
            {
                schemaUrl: "http://example.com",
                rel: "self"
            },
            {
                schemaUrl: "http://example.com",
                rel: "logout",
                context: {},
                data: {},
                serverRoot: "http://another.example.com/api/etc"
            }
        ]
            .forEach(function(input) {
                var result = assertingInputOK(ajv, jsonValidationError, PromiseSync)(input);
                expect(result._then).toBeDefined();
                expect(result._catch).toBeUndefined();
            });
    });

    it("should map itself on 'injection'", function() {
        var mapName = "assertingInputOK";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });
});
