var jsonValidationError = require("../lib/jsonValidationError").default;
var injection = require("../lib/jsonValidationError").injection;
var infusejs = require("infuse.js");

describe("jsonValidationError", function() {
    var container;
    var fakeErrArray;

    beforeEach(function() {
         container = new infusejs.Injector();

         fakeErrArray = [
            {
                dataPath: "dataPath",
                params: { param: "value" },
                message: "message"
            }
         ];
    });

    it("should be a function", function() {
        expect(jsonValidationError).toEqual(jasmine.any(Function));
    });

    it("should return an error", function() {
        var instance = new jsonValidationError(fakeErrArray, "source");

        expect(instance.message).not.toBeUndefined();
        expect(instance.stack).not.toBeUndefined();
    });

    it("should indicate where the message originated from", function() {
        var instance = new jsonValidationError(fakeErrArray, "source");

        expect(instance.message.indexOf("source: ")).toBe(0);
    });

    it("should compose from the first AJV error in the passed array", function() {
        // .map(err => `${ err.dataPath || JSON.stringify(err.params || {}) } ${ err.message }`)
        var instance = new jsonValidationError(fakeErrArray, "source");
        expect(instance.message).toBe("source: dataPath message");
        delete fakeErrArray[0].dataPath;
        instance = new jsonValidationError(fakeErrArray, "source");
        expect(instance.message).toBe("source: {\"param\":\"value\"} message");
    });

    it("should map itself on 'injection'", function() {
        var mapName = "JsonValidationError";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });
});
