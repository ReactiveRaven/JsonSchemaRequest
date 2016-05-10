var assertingResponseOK = require("../lib/assertingResponseOK").default;
var injection = require("../lib/assertingResponseOK").injection;
var infusejs = require("infuse.js");

describe("assertingResponseOK", function() {
    var container;
    var fakeBodyValidator;
    var fakeAjvInstance;
    var fakeAjv;
    var fakeTargetSchema;
    var fakeLink;
    var fakeResponse;
    beforeEach(function() {
        container = new infusejs.Injector();
        fakeBodyValidator = jasmine.createSpy("fakeBodyValidator").and.returnValue(true);
        fakeAjvInstance = jasmine.createSpyObj("fakeAjvInstance", [ "compile" ]);
        fakeAjvInstance.compile.and.returnValue(fakeBodyValidator);
        fakeAjv = jasmine.createSpy("fakeAjv").and.returnValue(fakeAjvInstance);
        container.mapValue("ajv", fakeAjv);
        fakeTargetSchema = {};
        fakeLink = {
            targetSchema: fakeTargetSchema
        };
        fakeResponse = {};
    });

    it("should be a function", function() {
        expect(assertingResponseOK).toEqual(jasmine.any(Function));
    });

    it("should throw early if the link targetSchema is not valid", function() {
        var fakeError = new Error();
        fakeAjvInstance.compile.and.throwError(fakeError);

        expect(function() { assertingResponseOK(fakeAjv)(fakeLink); }).toThrow();
    });

    it("should throw if the response is invalid", function() {
        fakeBodyValidator.and.returnValue(false);
        fakeBodyValidator.errors = [{ dataPath: "path", message: "message" }];

        expect(function() { assertingResponseOK(fakeAjv)(fakeLink)(fakeResponse); }).toThrow(new Error("path message"));
    });

    it("should pass through transparently if all is OK", function() {
        expect(assertingResponseOK(fakeAjv)(fakeLink)(fakeResponse)).toBe(fakeResponse);
    });

    it("should map itself on 'injection'", function() {
        var mapName = "assertingResponseOK";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });
});
