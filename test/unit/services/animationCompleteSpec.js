"use strict";
describe('animationComplete', function() {
    var $sniffer;
    it('throws an exception if the browser does not support css animations', inject(function($animationComplete, $sniffer) {
        $sniffer.animations = false;
        expect(function() {
            $animationComplete();
        }).toThrow();
    }));
    it('binds to animationend if no vendorPrefix exists', inject(function($animationComplete, $sniffer) {
        var el = angular.element('<div></div>'),
            spy = jasmine.createSpy();
        $sniffer.animations = true;
        $sniffer.vendorPrefix = '';
        spyOn(el, 'bind');
        $animationComplete(el, spy);
        expect(el.bind).toHaveBeenCalledWith('animationend', spy);
    }));
    it('binds to prefixed animationend if vendorPrefix exists', inject(function($animationComplete, $sniffer) {
        var el = angular.element('<div></div>'),
            spy = jasmine.createSpy();
        $sniffer.animations = true;
        $sniffer.vendorPrefix = 'Webkit';
        spyOn(el, 'bind');
        $animationComplete(el, spy);
        expect(el.bind).toHaveBeenCalledWith('animationend webkitAnimationEnd', spy);
    }));
});