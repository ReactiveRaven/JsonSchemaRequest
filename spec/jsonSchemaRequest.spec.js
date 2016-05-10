var jsonSchemaRequest = require("../lib/jsonSchemaRequest").default;
var injection = require("../lib/jsonSchemaRequest").injection;
var flowInjection = require("../lib/flow").injection;
var infusejs = require("infuse.js");
var utils = require("./_utils");
var PromiseSync = utils.PromiseSync;

describe("jsonSchemaRequest", function() {
    var container;
    var fakeAssertingInputOK;
    var fakeLink;
    var fakeMatchLinkInstance;
    var deflatedSchema;
    var inflatedSchema;
    var fakeComposeRequestInstance;
    var fakeComposeRequest;
    var fakeResponse;
    beforeEach(function() {
        container = new infusejs.Injector();
        fakeAssertingInputOK = jasmine.createSpy("assertingInputOK")
            .andReturn(PromiseSync.resolve(true));
        container.mapValue("assertingInputOK", fakeAssertingInputOK);
        deflatedSchema = { deflatedSchema: true };
        fakeFetchSchema = jasmine.createSpy("fakeFetchSchema").andReturn(deflatedSchema);
        container.mapValue("fetchSchema", fakeFetchSchema);
        inflatedSchema = { inflatedSchema: true };
        fakeExpandSchema = jasmine.createSpy("fakeExpandSchema").andReturn(inflatedSchema);
        container.mapValue("expandSchema", fakeExpandSchema);
        fakeLink = {};
        fakeMatchLinkInstance = jasmine.createSpy("fakeMatchLinkInstance").andReturn(fakeLink);
        fakeMatchLink = jasmine.createSpy("fakeMatchLink").andReturn(fakeMatchLinkInstance);
        container.mapValue("matchLink", fakeMatchLink);
        flowInjection(container);
        fakeComposeRequestInstance = jasmine.createSpy("fakeComposeRequestInstance");
        fakeComposeRequest = jasmine.createSpy("fakeComposeRequest")
            .andReturn(fakeComposeRequestInstance);
        container.mapValue("composeRequest", fakeComposeRequest);
        fakeResponse = { fakeResponse: true };
        fakeFiringRequest = jasmine.createSpy("fakeFiringRequest")
            .andReturn(PromiseSync.resolve(fakeResponse));
        container.mapValue("firingRequest", fakeFiringRequest);
        fakeAssertingResponseOK = jasmine.createSpy("fakeAssertingResponseOK");
        container.mapValue("assertingResponseOK", fakeAssertingResponseOK);
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
                schemaUrl: "Schema Url"
            };
        })

        it("should return a promise", function() {
            expect(instance(fakeRequestDef)).toEqual(jasmine.any(PromiseSync));
        });

        it("should validate the input", function() {
            expect(fakeAssertingInputOK).not.toHaveBeenCalled();

            instance(fakeRequestDef);

            expect(fakeAssertingInputOK).toHaveBeenCalledWith(fakeRequestDef);
        });

        it("should load the full schema with the given url", function() {
            expect(fakeFetchSchema).not.toHaveBeenCalled();

            instance(fakeRequestDef);

            expect(fakeFetchSchema).toHaveBeenCalledWith(fakeRequestDef.schemaUrl);
        });

        it("should inflate the schema with remote references", function() {
            expect(fakeExpandSchema).not.toHaveBeenCalled();

            instance(fakeRequestDef);

            expect(fakeExpandSchema).toHaveBeenCalledWith(deflatedSchema);
        });

        it("should find the link type given", function() {
            expect(fakeMatchLink).not.toHaveBeenCalled();
            expect(fakeMatchLinkInstance).not.toHaveBeenCalled();

            instance(fakeRequestDef);

            expect(fakeMatchLink).toHaveBeenCalledWith(fakeRequestDef);
            expect(fakeMatchLinkInstance).toHaveBeenCalledWith(inflatedSchema);
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
    })
});
