"use strict";
describe('templateCacheDecorator', function() {
    it('adds a keys() function to the $templateCache', inject(function($templateCache) {
        expect($templateCache.keys()).toEqual([]);
        $templateCache.put('someKey', null);
        expect($templateCache.keys()).toEqual(['someKey']);
    }));
});