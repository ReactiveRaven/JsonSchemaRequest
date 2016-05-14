var expandSchema = require("../lib/expandSchema").default;
var injection = require("../lib/expandSchema").injection;
var infusejs = require("infuse.js");
var utils = require("./_utils");
var deref = require("deref");

describe("expandSchema", function() {
    var container;
    var fakeSchemaFetcher;

    var exampleSchema;
    var metadataSchema;
    var expectedSchema;

    var knownUrls;

    beforeEach(function() {
        exampleSchema = {
            "id": "http://www.example.com/blog-post",
            "type": "object",
            "properties": {
                "id": { "type": "number" },
                "author": { "type": "string" },
                "title": { "type": "string" },
                "body": { "type": "string" },
                "metadata": { "$ref": "http://www.example.com/meta-data" }
            },
            "required": [ "title", "author", "id" ]
        };

        metadataSchema = {
            "id": "http://www.example.com/meta-data",
            "properties": {
                "created": {
                    "type": "number",
                    "description": "UTC unix timestamp"
                }
            }
        };

        expectedSchema = JSON.parse(JSON.stringify(exampleSchema));
        expectedSchema.properties.metadata = JSON.parse(JSON.stringify(metadataSchema));
        delete expectedSchema.properties.metadata.id;

        knownUrls = {};
        knownUrls[exampleSchema.id] = exampleSchema;
        knownUrls[metadataSchema.id] = metadataSchema;

        fakeSchemaFetcher = jasmine.createSpy("fakeSchemaFetcher")
            .and.callFake(url => {
                var found = knownUrls[url];
                if (found) {
                    return utils.PromiseSync.resolve(found);
                } else {
                    return utils.PromiseSync.reject("TEST: URL NOT FOUND");
                }
            });
        container = new infusejs.Injector();
        container.mapValue("deref", deref);
        container.mapValue("schemaFetcher", fakeSchemaFetcher);
        container.mapValue("Promise", utils.PromiseSync);
    });

    it("should be a function", function() {
        expect(expandSchema).toEqual(jasmine.any(Function));
    });

    it("should map itself on 'injection'", function() {
        var mapName = "expandSchema";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });

    it("should load refs and inline them", function() {
        injection(container);
        var expandSchema = container.getValue("expandSchema");

        expect(JSON.stringify(expandSchema("prefix")(exampleSchema)._then))
            .toBe(JSON.stringify(expectedSchema));
    });
});
