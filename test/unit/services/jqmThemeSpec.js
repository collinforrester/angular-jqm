"use strict";
describe('jqmTheme', function() {
    it('allows to read and write the default', function() {
        module(function(jqmThemeProvider) {
            var someTheme = "someTheme";
            expect(jqmThemeProvider.defaultTheme(someTheme)).toBe(someTheme);
            expect(jqmThemeProvider.defaultTheme()).toBe(someTheme);
        });
    });
    it('uses the theme "c" as default', function() {
        module(function(jqmThemeProvider) {
            expect(jqmThemeProvider.defaultTheme()).toBe("c");
        });
    });

    it('uses the default theme if no other theme is set', function() {
        var someTheme = "someTheme";
        module(function(jqmThemeProvider) {
            jqmThemeProvider.defaultTheme(someTheme);
        });
        inject(function(jqmTheme) {
            var div = angular.element("<div></div>");
            expect(jqmTheme(div)).toBe(someTheme);
        });
    });

    it("saves the given theme in the element and it's children", function() {
        var someTheme = "someTheme";
        inject(function(jqmTheme) {
            var div = angular.element("<div><div></div></div>"),
                child = div.children();
            jqmTheme(div, someTheme);
            expect(jqmTheme(div)).toBe(someTheme);
            expect(jqmTheme(child)).toBe(someTheme);
        });
    });
});