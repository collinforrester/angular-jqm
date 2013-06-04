"use strict";
describe('jqmButton', function() {
    var $compile, $rootScope;
    beforeEach(function() {
        module("jqm");
        inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });
    it('generates same markup as data-role="button"', function() {
        var v = markupValidator({
            ng: '<div jqm-button>Button</div>',
            jqm:'<div data-role="button">Button</div>'
        });
        v.check();
    });
});