var expandSchema = require("../lib/expandSchema").default;
var injection = require("../lib/expandSchema").injection;
var infusejs = require("infuse.js");
var utils = require("./_utils");

describe("expandSchema", function() {
    var container;
    var fakeAjv;
    var fakeAjvInstance;
    var fakeDeref;
    var fakeSchemaFetcher;
    var fakeValidator;
    var fakeRefs;
    var fakeDerefResult;
    var fakeChildSchema;
    var FAKE_SCHEMA_PREFIX;

    beforeEach(function() {
        fakeChildSchema = {};
        fakeDerefResult = {};
        fakeAjvInstance = jasmine.createSpyObj("fakeAjvInstance", [ "compileAsync" ]);
        fakeAjvInstance.compileAsync.and.callFake(function(schmea, cb) { cb(undefined, fakeValidator); });
        fakeAjv = jasmine.createSpy("fakeAjv").and.returnValue(fakeAjvInstance);
        fakeDeref = jasmine.createSpy("fakeDeref").and.returnValue(fakeDerefResult);
        fakeSchemaFetcher = jasmine.createSpy("fakeSchemaFetcher").and.returnValue(utils.PromiseSync.resolve(fakeChildSchema));
        FAKE_SCHEMA_PREFIX = "FAKE_SCHEMA_PREFIX";
        container = new infusejs.Injector();
        fakeValidator = jasmine.createSpy("fakeValidator");
        fakeRefs = {};
        fakeValidator.refs = fakeRefs;
        container.mapValue("ajv", fakeAjv);
        container.mapValue("deref", fakeDeref);
        container.mapValue("schemaFetcher", fakeSchemaFetcher);
        container.mapValue("Promise", utils.PromiseSync);
        container.mapValue("SCHEMA_PREFIX", FAKE_SCHEMA_PREFIX);
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

    it("should compile the schema async, loading missing schemas", function() {
        var exampleSchema = {};
        injection(container);
        expect(fakeAjvInstance.compileAsync).not.toHaveBeenCalled();
        container.getValue("expandSchema")(exampleSchema);
        expect(fakeAjvInstance.compileAsync).toHaveBeenCalledWith(exampleSchema, jasmine.any(Function));
    });

    it("should use the refs in the resultant validator and load them", function() {
        var exampleSchema = {};
        fakeRefs.fake_ref = {};
        injection(container);
        expect(fakeSchemaFetcher).not.toHaveBeenCalled();
        container.getValue("expandSchema")(exampleSchema);
        expect(fakeSchemaFetcher).toHaveBeenCalledWith("fake_ref");
    });

    it("should pass those other loaded schemas to deref to build the final schema", function() {
        var exampleSchema = {};
        fakeRefs.fake_ref = {};
        injection(container);
        expect(fakeDeref).not.toHaveBeenCalled();
        expect(container.getValue("expandSchema")(exampleSchema)._then).toBe(fakeDerefResult);
        expect(fakeDeref).toHaveBeenCalled();
        expect(fakeDeref.calls.argsFor(0)[0]).toBe(FAKE_SCHEMA_PREFIX);
        expect(fakeDeref.calls.argsFor(0)[1]).toBe(exampleSchema);
        expect(fakeDeref.calls.argsFor(0)[2]).toEqual([ fakeChildSchema ]);
        expect(fakeDeref.calls.argsFor(0)[3]).toBe(true);
    });
});
