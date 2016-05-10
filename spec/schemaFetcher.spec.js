const schemaFetcher = require("../lib/schemaFetcher").default;
var injection = require("../lib/schemaFetcher").injection;
var infusejs = require("infuse.js");

describe("schemaFetcher", function() {
    var container;
    var Promise;
    var fetch;
    var fetchConnection;
    var fetchPromise;
    beforeEach(function() {
        container = new infusejs.Injector();
        fetchConnection = jasmine.createSpyObj("fetchConnection", [ "json" ]);
        fetchPromise = jasmine.createSpyObj("fetchPromise", [ "then", "catch" ]);
        fetchPromise.then.and.callFake(cb => { cb(fetchConnection); return fetchPromise; });
        fetch = jasmine.createSpy("fetch").and.returnValue(fetchPromise);

        Promise = jasmine.createSpyObj("Promise", [ "resolve" ]);

        container.mapValue("fetch", fetch);
        container.mapValue("Promise", Promise);
    });

    it("should be a function", function() {
        expect(schemaFetcher).toEqual(jasmine.any(Function));
    });

    it("should produce a function when called with dependencies", function() {
        expect(schemaFetcher()).toEqual(jasmine.any(Function));
    });

    describe("when called", function() {
        var instance;

        beforeEach(function() {
            instance = schemaFetcher(fetch, Promise);
        });

        it("should attempt to fetch the request", () => {
            instance("testurl");

            expect(fetch).toHaveBeenCalledWith("testurl");
        });

        it("should only fetch once per schema url", function() {
            expect(fetch).not.toHaveBeenCalled();

            instance("testurl");

            expect(fetch).toHaveBeenCalled();
            expect(fetch.calls.count()).toBe(1);

            instance("testurl");

            expect(fetch.calls.count()).toBe(1);
        });

        it("should convert to json", function() {
            instance("testurl");

            expect(fetchConnection.json).toHaveBeenCalled();
        });
    });

    it("should map itself on 'injection'", function() {
        var mapName = "schemaFetcher";

        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });
});
