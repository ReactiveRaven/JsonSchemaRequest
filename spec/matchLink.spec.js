var matchLink = require("../lib/matchLink").default;
var injection = require("../lib/matchLink").injection;

var infusejs = require("infuse.js");

describe("matchLink", function() {
    var container;
    var instance;
    var fakeRequestDef;
    var noLinksError;
    var noMatchingLinkError;
    var tooManyMatchingLinksError;

    beforeEach(function() {
        container = new infusejs.Injector();
        fakeRequestDef = {
            rel: "FAKE_REL",
            schemaUrl: "FAKE_URL"
        };
        instance = matchLink(fakeRequestDef);
        noLinksError = new Error("Schema has no links, cannot create a request.");
        noMatchingLinkError = new Error("Could not find a link matching the given rel 'FAKE_REL' for FAKE_URL");
        tooManyMatchingLinksError = new Error("Found multiple links with the same rel!");
    });

    it("should be a function", function() {
        expect(matchLink).toEqual(jasmine.any(Function));
    });

    it("should throw if the schema has no links", function() {
        expect(instance.bind(null, { })).toThrow(noLinksError);
        expect(instance.bind(null, { links: { } })).toThrow(noLinksError);
        expect(instance.bind(null, { links: false })).toThrow(noLinksError);
        expect(instance.bind(null, { links: [ ] })).toThrow(noLinksError);
    });

    it("should throw if no matches were found", function() {
        expect(instance.bind(null, { links: [ { rel: "UNEXPECTED_REL" } ] })).toThrow(noMatchingLinkError);
    });

    it("should throw if too many matches were found", function() {
        expect(instance.bind(null, { links: [ { rel: "FAKE_REL" }, { rel: "FAKE_REL" } ] })).toThrow(tooManyMatchingLinksError);
    });

    it("should return the single matching link", function() {
        var fakeLink = { rel: "FAKE_REL" };
        expect(instance({ links: [ fakeLink ] })).toBe(fakeLink);
    });

    it("should map itself on 'injection'", function() {
        var mapName = "matchLink";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });
})
