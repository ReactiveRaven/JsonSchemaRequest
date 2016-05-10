var FormData = require("form-data");
var resolveDataForTransmission = require("../lib/resolveDataForTransmission").default;
var injection = require("../lib/resolveDataForTransmission").injection;
var infusejs = require("infuse.js");

describe("resolveDataForTransmission", function() {
    var container;

    beforeEach(function() {
        container = new infusejs.Injector();
        container.mapValue("FormData", FormData);
    });

    it("should be a function", function() {
        expect(resolveDataForTransmission).toEqual(jasmine.any(Function));
    });

    it("should simply return if the input is string", function() {
        var exampleString = "I am an example string";

        expect(resolveDataForTransmission(FormData)(exampleString)).toBe(exampleString);
    });

    it("should simply return if the input is an instance of FormData", function() {
        var fakeFormData = new FormData();

        expect(resolveDataForTransmission(FormData)(fakeFormData)).toBe(fakeFormData);
    });

    it("should stringify anything else", function() {
        var exampleObject = { foo: "bar" };

        expect(resolveDataForTransmission(FormData)(exampleObject))
            .toBe(JSON.stringify(exampleObject));
    });

    it("should throw if you try to send a function", function() {
        expect(function() { resolveDataForTransmission(FormData)(function() {}); }).toThrow();
    })

    it("should map itself on 'injection'", function() {
        var mapName = "resolveDataForTransmission";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });
});
