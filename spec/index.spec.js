var index = require("../lib/index").default;

describe("index", function() {
    it("should be a function", function() {
        expect(index).toEqual(jasmine.any(Function));
    });

    it("should not throw on instantiation", function() {
        expect(index).not.toThrow();
    });
});
