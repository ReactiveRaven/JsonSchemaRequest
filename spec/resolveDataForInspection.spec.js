var resolveDataForInspection = require("../lib/resolveDataForInspection").default;
var FormData = require("form-data");
var from = require("array.from").shim();
var injection = require("../lib/resolveDataForInspection").injection;
var infusejs = require("infuse.js");

describe("resolveDataForInspection", function() {
    var fakeFormData;
    var fakeEntriesIterator;
    var fakeData;
    var container;

    beforeEach(function() {
        container = new infusejs.Injector();

        fakeEntriesIterator = (() => {
            var pointer = 0;

            return () => ({
                next: () => ({
                    done: pointer >= Object.keys(fakeData).length,
                    value: Object.keys(fakeData).map(key => [ key, fakeData[key] ])[pointer++]
                })
            });
        })();
        fakeFormData = new FormData();
        fakeFormData.entries = jasmine.createSpy("entries").and.returnValue(fakeEntriesIterator());

        fakeData = {
            "foo": "bar",
            "baz": "quux"
        };
        Object.keys(fakeData).forEach(key => fakeFormData.append(key, fakeData[key]));

        container.mapValue("FormData", FormData);
        container.mapValue("from", from);
    });

    it("should be a function", function() {
        expect(resolveDataForInspection).toEqual(jasmine.any(Function));
    });

    // for node compatibility
    it("should accept FormData being injected", function() {
        expect(resolveDataForInspection(FormData, from)).toEqual(jasmine.any(Function));
    })

    it("should expand FormData to an object", function() {
        var resolved = resolveDataForInspection(FormData, from)(fakeFormData);
        expect(resolved).toEqual(jasmine.any(Object));
        expect(JSON.stringify(resolved)).toEqual(JSON.stringify(fakeData));
    });

    it("should ignore any other type and return transparently", function() {
        var exampleData = {};
        expect(resolveDataForInspection(FormData, from)(exampleData)).toBe(exampleData);
    });

    it("should map itself on 'injection'", function() {
        var mapName = "resolveDataForInspection";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });
});
