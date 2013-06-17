"use strict";
describe('testutils', function() {
    var $;
    beforeEach(function() {
        $ = angular.element;
    });
    describe('compareElement', function() {
        function createCompareSpec(not, differenceType, el1, el2) {
            it('detects '+not+'diffs in '+differenceType, function() {
                var test = expect(function() {
                    testutils.compareElement($(el1), $(el2));
                });
                if (not) {
                    test = test.not;
                }
                test.toThrow();
            });
        }
        function detectsDiffsIn(differenceType, el1, el2) {
            createCompareSpec('', differenceType, el1, el2);
        }

        function detectsNoDiffsIn(differenceType, el1, el2) {
            createCompareSpec('no ', differenceType, el1, el2);
        }

        detectsDiffsIn('element name', '<div></div>', '<span></span>');
        detectsDiffsIn('class name', '<div class="a"></div>', '<div class="b"></div>');
        detectsDiffsIn('text content', '<div>a</div>', '<div>b</div>');
        detectsNoDiffsIn('class name order', '<div class="a b"></div>', '<div class="b a"></div>');
        detectsNoDiffsIn('class diffs with ng- classes', '<div class="ng-a"></div>', '<div class="ng-b"></div>');
        detectsNoDiffsIn('class diffs with jqm* classes', '<div class="jqmA"></div>', '<div class="jqmB"></div>');
        detectsNoDiffsIn('same elements', '<div class="a">test</div>', '<div class="a">test</div>');
        detectsNoDiffsIn('children', '<div><div></div></div>', '<div><span></span></div>');
    });
    describe('compareElementRecursive', function() {
        it('detects diffs in the element', function() {
            expect(function() {
                testutils.compareElementRecursive($('<div></div>'), $('<span></span>'));
            }).toThrow();
        });
        it('detects diffs in children', function() {
            expect(function() {
                testutils.compareElementRecursive($('<div><div></div></div>'), $('<div><span></span></div>'));
            }).toThrow();
        });
    });
    describe('fireEvent', function() {
        it('fires an event on an element', function() {
            var el = angular.element('<div></div>'),
                spy = jasmine.createSpy();
            el.bind('click', spy);
            testutils.fireEvent(el, 'click');
            expect(spy).toHaveBeenCalled();
        });
        it('merges the given props into the event', function() {
            var el = angular.element('<div></div>'),
                spy = jasmine.createSpy(),
                evt = {a:1},
                realEvt;
            el.bind('click', spy);
            testutils.fireEvent(el, 'click', evt);
            expect(spy).toHaveBeenCalled();
            realEvt = spy.mostRecentCall.args[0];
            expect(realEvt.a).toBe(1);
        });
    });
    describe('ng', function() {
        var api;
        beforeEach(function() {
            api = testutils.ng;
        });
        createCommonTests('ng');
    });
    describe('jqm', function() {
        var api;
        beforeEach(function() {
            api = testutils.jqm;
        });
        createCommonTests('jqm');
        describe('tick - further test cases', function() {
            it('does not control timeouts in the main window', function() {
                var spy = jasmine.createSpy();
                window.setTimeout(spy, 1000);
                expect(spy).not.toHaveBeenCalled();
                api.tick(1000);
                expect(spy).not.toHaveBeenCalled();
            });
        });
    });

    function createCommonTests(apiName) {
        var api, emptyPageStr;
        beforeEach(function() {
            api = testutils[apiName];
            emptyPageStr = '<div '+api.pageAttr+'></div>';
        });
        describe('tick', function() {
            it('controls timeouts in the corresponding window', function() {
                var spy = jasmine.createSpy();
                api.win.setTimeout(spy, 1000);
                expect(spy).not.toHaveBeenCalled();
                api.tick(1000);
                expect(spy).toHaveBeenCalled();
            });
        });
        describe('activePage', function() {
            it('returns the children of the viewport', function() {
                var page = api.init(emptyPageStr);
                expect(api.activePage()[0]).toBe(page[0]);
                expect(api.activePage().hasClass("ui-page")).toBe(true);
            });
        });
        describe('init', function() {
            it('compiles simple elements within an implicit page and returns them', function() {
                var el = api.init('<div id="test"></div>');
                expect(el.attr("id")).toBe("test");
                expect(api.activePage().hasClass("ui-page")).toBe(true);
                expect(api.activePage().children()[0]).toBe(el[0]);
            });
            it('compiles pages and returns them', function() {
                var el = api.init(emptyPageStr);
                expect(el[0]).toBe(api.activePage()[0]);
                expect(el.hasClass("ui-page")).toBe(true);
            });
            it('compiles multiple pages and returns the viewPort', function() {
                var viewPort = api.init({
                    '': {
                        template: '<div '+api.pageAttr+'>firstPage</div>'
                    },
                    '/page2': {
                        template: '<div '+api.pageAttr+'>secondPage</div>',
                        transition: 'none'
                    }
                });
                expect(viewPort.hasClass('ui-viewport'));
                expect(viewPort[0]).toBe(api.viewPort[0]);
                expect(api.activePage().text()).toBe('firstPage');
            });
        });
        describe('beginTransitionTo', function() {
            it('switches between pages if transition is none', function() {
                var viewPort = api.init({
                    '': {
                        template: '<div '+api.pageAttr+'>firstPage</div>'
                    },
                    '/page2': {
                        template: '<div '+api.pageAttr+'>secondPage</div>',
                        transition: 'none'
                    }
                });
                expect(api.activePage().text()).toBe('firstPage');
                api.beginTransitionTo('/page2');
                api.tick(10);
                expect(api.activePage().text()).toBe('secondPage');
            });
        });
        describe('fireAnimationEndEvents', function() {
            it('triggers animationend listeners for elements with .in classes', function() {
                var spy = jasmine.createSpy();
                var el = api.init('<div class="in"></div>');
                el.bind('animationend', spy);
                api.fireAnimationEndEvents();
                expect(spy).toHaveBeenCalled();
            });
            it('triggers animationend listeners for elements with .out classes', function() {
                var spy = jasmine.createSpy();
                var el = api.init('<div class="out"></div>');
                el.bind('animationend', spy);
                api.fireAnimationEndEvents();
                expect(spy).toHaveBeenCalled();
            });
        });
    }
});