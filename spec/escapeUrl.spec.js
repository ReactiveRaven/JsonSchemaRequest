var escapeUrl = require("../lib/escapeUrl").default;
var injection = require("../lib/escapeUrl").injection;
var infusejs = require("infuse.js");

describe("escapeUrl", function() {
    var container;
    beforeEach(function() {
        container = new infusejs.Injector();
    });

    it("should be a function", function() {
        expect(escapeUrl).toEqual(jasmine.any(Function));
    });

    it("should pass the json-hyper-schema example tests", function() {
        [
            [ "no change", "no change" ],
            [ "(no change)", "(no change)" ],
            [ "{(escape space)}", "{escape%20space}" ],
            [ "{(escape+plus)}", "{escape%2Bplus}" ],
            [ "{(escape*asterisk)}", "{escape%2Aasterisk}" ],
            [ "{(escape(bracket)}", "{escape%28bracket}" ],
            [ "{(escape))bracket)}", "{escape%29bracket}" ],
            [ "{(a))b)}", "{a%29b}" ],
            [ "{(a (b)))}", "{a%20%28b%29}" ],
            [ "{()}", "{%65mpty}" ],
            [ "{+$*}", "{+%73elf*}" ],
            [ "{+($)*}", "{+%24*}" ]
        ]
            .forEach(inout => expect(escapeUrl(inout[0])).toBe(inout[1]));
    });

    it("should map itself on 'injection'", function() {
        var mapName = "escapeUrl";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });
});
