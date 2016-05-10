var flow = require("../lib/flow").default;
var injection = require("../lib/flow").injection;
var infusejs = require("infuse.js");

describe("flow", function() {
    var container;
    beforeEach(function() {
        container = new infusejs.Injector();
    });

    it("should be a function", function() {
        expect(flow).toEqual(jasmine.any(Function));
    });

    it("should apply the functions in order", function() {
        var double = function(input) { return input * 2; };
        var minusOne = function(input) { return input - 1; };

        expect(flow(double, minusOne)(2)).toBe(3);
        expect(flow(minusOne, double)(2)).toBe(2);
    });

    it("should map itself on 'injection'", function() {
        var mapName = "flow";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });
});
