"use strict";
describe('jqmViewCache', function() {
    it('creates a cache using cacheFactory', inject(function($jqmViewCache) {
        var someEntry = {};
        $jqmViewCache.put('/someUrl', someEntry);
        expect($jqmViewCache.get('/someUrl')).toBe(someEntry);
    }));
});