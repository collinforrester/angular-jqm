"use strict";
describe('browserDecorator', function () {
    it('should decode urls with %23 instead of hash for android', inject(function($browser) {
        expect($browser.url('a%23b').url()).toBe('a#b');
    }));

    it('should decode urls with blank instead of %20 for ios 5', inject(function($browser) {
        expect($browser.url('a b').url()).toBe('a%20b');
    }));

    // Note: The functions that integrate $browser with $history are
    // implicitly tested in historySpec.js
});