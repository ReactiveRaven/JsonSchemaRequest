var firingRequest = require("../lib/firingRequest").default;
var injection = require("../lib/firingRequest").injection;
var infusejs = require("infuse.js");
var utils = require("./_utils");
var PromiseSync = utils.PromiseSync;

describe("firingRequest", function() {
    var container;
    var fakeFetch;
    var fakeResponse;
    var fakeData;
    var fakeBody;

    beforeEach(function() {
        container = new infusejs.Injector();
        fakeData = {};
        fakeBody = {
            data: fakeData
        };
        fakeResponse = {
            status: 200,
            json: jasmine.createSpy("json").andReturn(PromiseSync.resolve(fakeBody)),
        };
        fakeFetch = jasmine.createSpy("fetch").andReturn(PromiseSync.resolve(fakeResponse));
        container.mapValue("fetch", fakeFetch);
    });

    it("should be a function", function() {
        expect(firingRequest).toEqual(jasmine.any(Function));
    });

    it("should map itself on 'injection'", function() {
        var mapName = "firingRequest";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });

    describe("", function () {
        var instance;
        var fakeRequestDef;
        var fakeUrl;
        var fakeArgs;

        beforeEach(function() {
            injection(container);
            instance = container.getValue("firingRequest");
            fakeRequestDef = {};
            fakeUrl = {};
            fakeArgs = { request: fakeRequestDef, url: fakeUrl };
        })

        it("should call `fetch` with the given url and request definition", function() {
            instance(fakeArgs);

            expect(fakeFetch).toHaveBeenCalledWith(fakeUrl, fakeRequestDef);
        });

        it("should call `.json` to process the response body", function() {
            instance(fakeArgs);

            expect(fakeResponse.json).toHaveBeenCalled();
        });

        it("should reject if the response code is not in the 2xx range", function() {
            fakeResponse.status = 404;
            expect(instance(fakeArgs)._catch).toBeDefined();
            fakeResponse.status = 100;
            expect(instance(fakeArgs)._catch).toBeDefined();
            fakeResponse.status = 299;
            expect(instance(fakeArgs)._then).toBeDefined();
            fakeResponse.status = 200;
            expect(instance(fakeArgs)._then).toBeDefined();
        });
    });
});
