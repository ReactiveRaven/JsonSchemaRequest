var jsonSchemaRequest = require("../lib/jsonSchemaRequest").default;
var injection = require("../lib/jsonSchemaRequest").injection;
var infusejs = require("infuse.js");
var deref = require("deref");
var utils = require("./_utils");
var PromiseSync = utils.PromiseSync;

describe("jsonSchemaRequest", function() {
    var container;
    var fakeAssertingInputOK;
    var fakeLink;
    var fakeMatchLinkInstance;
    var fakeComposeRequestInstance;
    var fakeComposeRequest;
    var fakeResponse;
    var fakeSchemaUrl;
    var fakeJsonTree;
    var fakeJsonSchemaLoadTree;
    beforeEach(function() {
        container = new infusejs.Injector();
        fakeAssertingInputOK = jasmine.createSpy("assertingInputOK")
            .and.returnValue(PromiseSync.resolve(true));
        container.mapValue("assertingInputOK", fakeAssertingInputOK);
        fakeLink = {};
        fakeMatchLinkInstance = jasmine.createSpy("fakeMatchLinkInstance").and.returnValue(fakeLink);
        fakeMatchLink = jasmine.createSpy("fakeMatchLink").and.returnValue(fakeMatchLinkInstance);
        container.mapValue("matchLink", fakeMatchLink);
        fakeComposeRequestInstance = jasmine.createSpy("fakeComposeRequestInstance");
        fakeComposeRequest = jasmine.createSpy("fakeComposeRequest")
            .and.returnValue(fakeComposeRequestInstance);
        container.mapValue("composeRequest", fakeComposeRequest);
        fakeResponse = { fakeResponse: true };
        fakeFiringRequest = jasmine.createSpy("fakeFiringRequest")
            .and.returnValue(PromiseSync.resolve(fakeResponse));
        container.mapValue("firingRequest", fakeFiringRequest);
        fakeAssertingResponseOK = jasmine.createSpy("fakeAssertingResponseOK");
        container.mapValue("assertingResponseOK", fakeAssertingResponseOK);

        fakeSchemaUrl = "http://www.example.com/blog-post.json";

        fakeJsonTree = {
            "http://www.example.com/blog-post.json": {
                "id": "http://www.example.com/blog-post.json",
                "type": "object",
                "properties": {
                    "id": { "type": "number" },
                    "author": { "type": "string" },
                    "title": { "type": "string" },
                    "body": { "type": "string" },
                    "metadata": { "$ref": "http://www.example.com/metadata.json" }
                },
                "required": [ "title", "author", "id" ]
            },
            "http://www.example.com/metadata.json": {
                "id": "http://www.example.com/metadata.json",
                "type": "object",
                "properties": {
                    "created": { "$ref": "types.json#/definitions/timestamp" }
                }
            },
            "http://www.example.com/types.json": {
                "id": "http://www.example.com/types.json",
                "definitions": {
                    "timestamp": {
                        "type": "number",
                        "description": "UTC Unix timestamp"
                    }
                }
            }
        };
        fakeJsonSchemaLoadTree = jasmine.createSpy("fakeJsonSchemaLoadTree").and.returnValue(fakeJsonTree);
        container.mapValue("jsonSchemaLoadTree", fakeJsonSchemaLoadTree);

        container.mapValue("deref", deref);
    });

    it("should be a function", function() {
        expect(jsonSchemaRequest).toEqual(jasmine.any(Function));
    });

    it("should map itself on 'injection'", function() {
        var mapName = "jsonSchemaRequest";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });

    describe("", function() {
        var instance;
        var fakeRequestDef;

        beforeEach(function() {
            injection(container);

            instance = container.getValue("jsonSchemaRequest");

            fakeRequestDef = {
                schemaUrl: fakeSchemaUrl
            };
        });

        it("should return a promise", function() {
            expect(instance(fakeRequestDef)).toEqual(jasmine.any(PromiseSync));
        });


        it("should validate the input", function() {
            expect(fakeAssertingInputOK).not.toHaveBeenCalled();

            instance(fakeRequestDef);

            expect(fakeAssertingInputOK).toHaveBeenCalledWith(fakeRequestDef);
        });

        it("should load the full schema with the given url", function() {
            expect(fakeJsonSchemaLoadTree).not.toHaveBeenCalled();

            instance(fakeRequestDef);

            expect(fakeJsonSchemaLoadTree).toHaveBeenCalledWith(fakeRequestDef.schemaUrl);
        });

        it("should find the link type given", function() {
            expect(fakeMatchLink).not.toHaveBeenCalled();
            expect(fakeMatchLinkInstance).not.toHaveBeenCalled();

            instance(fakeRequestDef);

            expect(fakeMatchLink).toHaveBeenCalledWith(fakeRequestDef);
            expect(fakeMatchLinkInstance).toHaveBeenCalled();
        });

        it("should make the request", function() {
            expect(fakeComposeRequestInstance).not.toHaveBeenCalled();
            expect(fakeComposeRequest).not.toHaveBeenCalled();
            expect(fakeFiringRequest).not.toHaveBeenCalled();

            instance(fakeRequestDef);

            expect(fakeComposeRequest).toHaveBeenCalledWith(fakeRequestDef);
            expect(fakeComposeRequestInstance).toHaveBeenCalledWith(fakeLink);
            expect(fakeFiringRequest).toHaveBeenCalled();
        });

        it("should validate the response", function() {
            expect(fakeAssertingResponseOK).not.toHaveBeenCalled();

            instance(fakeRequestDef);

            expect(fakeAssertingResponseOK).toHaveBeenCalled();
        });
    });
});
