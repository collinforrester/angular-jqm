"use strict";
describe('history', function () {
    beforeEach(function() {
        jasmine.Clock.useMock();
        spyOn(window.history, 'go');
    });

    describe('go', function () {
        it('should call window.history.go asynchronously', inject(function ($history) {
            // Why asynchronously?
            // Because some browsers (Firefox and IE10) trigger the popstate event in sync,
            // which gets us into trouble for $location.backMode().
            $history.go(10);
            expect(window.history.go).not.toHaveBeenCalled();
            jasmine.Clock.tick(50);
            expect(window.history.go).toHaveBeenCalledWith(10);
        }));
    });

    function browserUrl(base, path) {
        return base+'/#'+path;
    }

    describe('changing the url programmatically', function () {
        it('should record successful url changes', inject(function ($history, $location, $rootScope) {
            expect($history.previousIndex).toBe(-1);
            expect($history.activeIndex).toBe(-1);
            $location.path("path1");
            $rootScope.$apply();
            expect($history.activeIndex).toBe(0);
            expect($history.previousIndex).toBe(-1);
            $location.path("path2");
            $rootScope.$apply();
            expect($history.previousIndex).toBe(0);
            expect($history.activeIndex).toBe(1);
            expect($history.urlStack[0].url).toEqual(browserUrl('http://server','/path1'));
            expect($history.urlStack[1].url).toEqual(browserUrl('http://server','/path2'));
            expect($history.urlStack.length).toBe(2);
        }));

        it('should remove trailing entries from the urlStack when adding new entries', inject(function ($history, $location, $rootScope) {
            $location.path("path1");
            $rootScope.$apply();

            $history.activeIndex = -1;

            $location.path("path2");
            $rootScope.$apply();
            expect($history.activeIndex).toBe(0);

            expect($history.urlStack[0].url).toEqual(browserUrl('http://server','/path2'));
            expect($history.urlStack.length).toBe(1);
        }));

        it('should record multiple url changes to the same url only once', inject(function ($history, $browser) {
            $browser.url(browserUrl("http://server","/url1"));
            $browser.url(browserUrl("http://server", "/url1"));
            expect($history.urlStack).toEqual([{url: browserUrl('http://server','/url1')}]);
        }));

        it('should not record url changes of aborted location changes', inject(function ($history, $location, $rootScope) {
            $rootScope.$on('$locationChangeStart', function (event) {
                event.preventDefault();
            });
            $location.path("path1");
            $rootScope.$apply();
            expect($history.urlStack).toEqual([]);
        }));

        it('should replace the last entry if $location.replace is used', inject(function ($history, $location, $rootScope) {
            $location.path("path1");
            $rootScope.$apply();
            expect($history.activeIndex).toBe(0);
            $location.path("path2");
            $location.replace();
            $rootScope.$apply();
            expect($history.previousIndex).toBe(0);
            expect($history.activeIndex).toBe(0);
            expect($history.urlStack[0].url).toEqual(browserUrl('http://server','/path2'));
            expect($history.urlStack.length).toBe(1);
        }));

        it('should remove trailing entries from the urlStack when replacing the current entry', inject(function ($history, $location, $rootScope) {
            $location.path("path1");
            $rootScope.$apply();
            $location.path("path2");
            $rootScope.$apply();

            $history.activeIndex = 0;

            $location.path("path3");
            $location.replace();
            $rootScope.$apply();
            expect($history.activeIndex).toBe(0);
            expect($history.urlStack[0].url).toEqual(browserUrl('http://server','/path3'));
            expect($history.urlStack.length).toBe(1);
        }));
    });

    describe('hash listening', function () {
        it('should update the activeIndex based on the url', inject(function ($location, $rootScope, $browser, $history) {
            $location.path("path1");
            $rootScope.$apply();
            $location.path("path2");
            $rootScope.$apply();

            $browser.$$url = browserUrl('http://server','/path1');
            $browser.poll();

            expect($history.activeIndex).toBe(0);
        }));

        it('should append the url to the stack if the url is not know', inject(function ($browser, $history) {
            $browser.$$url = browserUrl('http://server','/path1');
            $browser.poll();

            expect($history.activeIndex).toBe(0);
            expect($history.urlStack[0].url).toBe(browserUrl('http://server','/path1'));
        }));

        it('should set previousIndex to the last index before navigation', inject(function ($location, $rootScope, $browser, $history) {
            $location.path("path1");
            $rootScope.$apply();
            $location.path("path2");
            $rootScope.$apply();

            $browser.$$url = browserUrl('http://server', '/path1');
            $browser.poll();

            expect($history.previousIndex).toBe(1);
        }));
    });
});