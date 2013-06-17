"use strict";
describe('jqmTheme directive', function () {
    it('sets the given theme in the element', inject(function (jqmTheme) {
        var div = testutils.ng.init('<div jqm-theme="someTheme"></div>');
        expect(jqmTheme(div)).toBe('someTheme');
    }));
    it('does not set a theme if no value is given', inject(function (jqmTheme) {
        var div = testutils.ng.init('<div jqm-theme="someParentTheme"><div jqm-theme></div></div>'),
            child = div.children();
        expect(jqmTheme(child)).toBe('someParentTheme');
    }));
});
