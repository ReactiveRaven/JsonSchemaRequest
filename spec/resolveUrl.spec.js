var resolveUrl = require("../lib/resolveUrl").default;
var injection = require("../lib/resolveUrl").injection;
var infusejs = require("infuse.js");

describe("resolveUrl", function() {
    var container;

    beforeEach(function() {
         container = new infusejs.Injector();
    });

    it("should be a function", function() {
        expect(resolveUrl).toEqual(jasmine.any(Function));
    });

    it("should return the url if it begins with 'http'", function() {
        const exampleUrl = "http is all you need";
        expect(resolveUrl(exampleUrl)).toBe(exampleUrl);
    });

    it("should prefix with the given serverRoot", function() {
        const exampleUrl = "not a full url";
        const exampleRoot = "root prefix";
        expect(resolveUrl(exampleUrl, { serverRoot: exampleRoot })).toBe(exampleRoot + exampleUrl);
    });

    it("should not crash if no serverRoot is found", function() {
        const exampleUrl = "not a full url";
        expect(resolveUrl(exampleUrl, { })).toBe(exampleUrl);
    });

    it("should map itself on 'injection'", function() {
        var mapName = "resolveUrl";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });
});
