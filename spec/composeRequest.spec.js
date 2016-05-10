var composeRequest = require("../lib/composeRequest").default;
var injection = require("../lib/composeRequest").injection;

var infusejs = require("infuse.js");

describe("composeRequest", function() {
    var container;
    beforeEach(function() {
        container = new infusejs.Injector();
    });

    it("should be a function", function() {
        expect(composeRequest).toEqual(jasmine.any(Function));
    });

    it("should map itself on 'injection'", function() {
        var mapName = "composeRequest";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);
    });

    describe("", function() {
        var instance;
        var fakeBodyValidator;
        var fakeAjvInstance;
        var fakeAjv;
        var fakeEscapeUrl;
        var fakeResolveDataForInspection;
        var fakeResolveDataForTransmission;
        var fakeResolveUrl;
        var fakeUriTemplate;
        var fakeUriTemplates;
        var fakeRequestDef;
        var fakeLink;

        beforeEach(function() {
            var identityFunction = function(input) { return input; };
            fakeBodyValidator = jasmine.createSpy("fakeBodyValidator").and.returnValue(true);
            fakeAjvInstance = jasmine.createSpyObj("fakeAjvInstance", [ "compile" ]);
            fakeAjvInstance.compile.and.returnValue(fakeBodyValidator);
            fakeAjv = jasmine.createSpy("fakeAjv").and.returnValue(fakeAjvInstance);
            fakeEscapeUrl = jasmine.createSpy("fakeEscapeUrl")
                .and.callFake(identityFunction);
            fakeResolveDataForInspection = jasmine.createSpy("fakeResolveDataForInspection")
                .and.callFake(identityFunction);
            fakeResolveDataForTransmission = jasmine.createSpy("fakeResolveDataForTransmission")
                .and.callFake(identityFunction);
            fakeResolveUrl = jasmine.createSpy("fakeResolveUrl")
                .and.callFake(identityFunction);
            fakeUriTemplate = jasmine.createSpyObj("fakeUriTemplate", [ "fill" ]);
            fakeUriTemplate.varNames = [ "bar", "quux" ];
            fakeUriTemplate.fill.and.returnValue("foo/BAR/baz/QUUX/corge");
            fakeUriTemplates = jasmine.createSpy("fakeUriTemplates").and.returnValue(fakeUriTemplate);
            fakeRequestDef = {
                context: {
                    bar: "BAR",
                    quux: "QUUX"
                },
                data: {
                    ibble: "IBBLE",
                    wibble: "WIBBLE"
                }
            };

            fakeLink = {
                href: "foo/{bar}/baz/{quux}",
                schema: {}
            };

            instance = composeRequest(
                fakeAjv,
                fakeEscapeUrl,
                fakeResolveDataForInspection,
                fakeResolveDataForTransmission,
                fakeResolveUrl,
                fakeUriTemplates
            )(fakeRequestDef);
        });

        it("should escape the href as per json-hyper-schema spec", function() {
            expect(fakeEscapeUrl).not.toHaveBeenCalled();

            try { instance(fakeLink); } catch (e) { }

            expect(fakeEscapeUrl).toHaveBeenCalledWith(fakeLink.href);
        });

        it("should return an object with 'url' and 'request' keys", function() {
            var result = instance(fakeLink);

            expect(result.url).toBeDefined();
            expect(result.request).toBeDefined();
        });


        it("should return the link as well", function() {
            var result = instance(fakeLink);

            expect(result.link).toBe(fakeLink);
        });

        it("should throw if there are missing keys in the url", function() {
            delete fakeRequestDef.context;

            expect(function() {
                instance(fakeLink);
            }).toThrow(new Error("Missing keys for request: " + fakeUriTemplate.varNames.join(", ")));
        });

        describe("handling body schema", function() {
            it("should throw if a schema is provided, and doesn't match the body", function() {
                fakeBodyValidator.and.returnValue(false);
                fakeBodyValidator.errors = [
                    {
                        dataPath: "dataPath",
                        message: "message"
                    }
                ];

                expect(function() {
                    instance(fakeLink);
                }).toThrow(new Error("dataPath message"));
            });

            it("should not throw if no schema is provided", function() {
                fakeBodyValidator.and.returnValue(false);
                fakeBodyValidator.errors = [
                    {
                        dataPath: "dataPath",
                        message: "message"
                    }
                ];

                delete fakeLink.schema;

                expect(function() { instance(fakeLink); }).not.toThrow();
            });
        });
    });
});
