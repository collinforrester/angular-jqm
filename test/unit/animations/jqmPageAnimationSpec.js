"use strict";
describe('jqmPageAnimation', function () {
    /*global PAGE_ANIMATION_DEFS */

    var animationCompleteQueue;

    function fireNextAnimationEvent() {
        if (!animationCompleteQueue.length) {
            return;
        }
        animationCompleteQueue.shift().cb();
    }

    beforeEach(function () {
        animationCompleteQueue = [];
        module(function ($provide) {
            $provide.factory('$animationComplete', function () {
                return function (element, callback) {
                    animationCompleteQueue.push({
                        el: element,
                        cb: callback
                    });
                };
            });
        });
    });

    describe('parallel animations', function () {
        var enter, leave, enterEl, leaveEl, parentEl;
        beforeEach(function () {
            testutils.ng.enableTransitions(true);
            inject(function (jqmPageSlideEnterAnimation, jqmPageSlideLeaveAnimation) {
                enter = jqmPageSlideEnterAnimation;
                leave = jqmPageSlideLeaveAnimation;
                enterEl = angular.element('<div></div>');
                leaveEl = angular.element('<div class="ui-page-active"></div>');
                parentEl = angular.element('<div></div>').append(enterEl).append(leaveEl);
            });
        });
        describe('setup', function () {
            it('adds the correct classes when enter is called before leave', function () {
                enter.setup(enterEl);
                expect(enterEl.prop("className")).toBe('slide in ui-page-active');
                expect(parentEl.prop("className")).toBe('ui-mobile-viewport-transitioning viewport-slide');

                leave.setup(leaveEl);
                expect(leaveEl.prop("className")).toBe('ui-page-active slide out');
            });
            it('adds the correct classes when leave is called before enter', function () {
                leave.setup(leaveEl);
                expect(leaveEl.prop("className")).toBe('ui-page-active slide out');
                expect(parentEl.prop("className")).toBe('ui-mobile-viewport-transitioning viewport-slide');

                enter.setup(enterEl);
                expect(enterEl.prop("className")).toBe('slide in ui-page-active');
            });
            it('removes the classes after animationComplete', function () {
                enter.setup(enterEl);

                leave.setup(leaveEl);
                fireNextAnimationEvent();
                expect(enterEl.prop("className")).toBe('ui-page-active');

                fireNextAnimationEvent();
                expect(leaveEl.prop("className")).toBe('');
                expect(parentEl.prop("className")).toBe('');
            });
        });
        describe('start', function () {
            var enterFinished, leaveFinished;
            beforeEach(function () {
                enterFinished = jasmine.createSpy('enterFinished');
                leaveFinished = jasmine.createSpy('leaveFinished');
            });
            it('calls the given callback if both animations are already complete', function () {
                var enterMemento = enter.setup(enterEl);
                var leaveMemento = leave.setup(leaveEl);
                fireNextAnimationEvent();
                fireNextAnimationEvent();
                enter.start(enterEl, enterFinished, enterMemento);
                expect(enterFinished).toHaveBeenCalled();
                leave.start(leaveEl, leaveFinished, leaveMemento);
                expect(leaveFinished).toHaveBeenCalled();
            });
            it('calls the given callback after both animations are complete', function () {
                var enterMemento = enter.setup(enterEl);
                var leaveMemento = leave.setup(leaveEl);
                enter.start(enterEl, enterFinished, enterMemento);
                leave.start(leaveEl, leaveFinished, leaveMemento);
                expect(enterFinished).not.toHaveBeenCalled();
                expect(leaveFinished).not.toHaveBeenCalled();

                fireNextAnimationEvent();
                expect(enterFinished).not.toHaveBeenCalled();
                expect(leaveFinished).not.toHaveBeenCalled();

                fireNextAnimationEvent();
                expect(enterFinished).toHaveBeenCalled();
                expect(leaveFinished).toHaveBeenCalled();
            });
        });
    });
    describe('sequential animations', function () {
        var enter, leave, enterEl, leaveEl, parentEl;
        beforeEach(function () {
            testutils.ng.enableTransitions(true);
            inject(function (jqmPageFadeEnterAnimation, jqmPageFadeLeaveAnimation) {
                enter = jqmPageFadeEnterAnimation;
                leave = jqmPageFadeLeaveAnimation;
                enterEl = angular.element('<div></div>');
                leaveEl = angular.element('<div class="ui-page-active"></div>');
                parentEl = angular.element('<div></div>').append(enterEl).append(leaveEl);
            });
        });
        describe('enter', function () {
            it('adds the correct classes when enter is called before leave', function () {
                enter.setup(enterEl);
                expect(enterEl.prop("className")).toBe('');
                expect(parentEl.prop("className")).toBe('ui-mobile-viewport-transitioning viewport-fade');

                leave.setup(leaveEl);
                expect(leaveEl.prop("className")).toBe('ui-page-active fade out');

                fireNextAnimationEvent();
                expect(enterEl.prop("className")).toBe('fade in ui-page-active');
            });
            it('adds the correct classes when leave is called before enter', function () {
                leave.setup(leaveEl);
                expect(leaveEl.prop("className")).toBe('ui-page-active fade out');
                expect(parentEl.prop("className")).toBe('ui-mobile-viewport-transitioning viewport-fade');

                enter.setup(enterEl);
                expect(enterEl.prop("className")).toBe('');

                fireNextAnimationEvent();
                expect(enterEl.prop("className")).toBe('fade in ui-page-active');
            });
            it('removes the classes after animationComplete', function () {
                enter.setup(enterEl);
                leave.setup(leaveEl);

                fireNextAnimationEvent();
                expect(leaveEl.prop("className")).toBe('');

                fireNextAnimationEvent();
                expect(enterEl.prop("className")).toBe('ui-page-active');
                expect(parentEl.prop("className")).toBe('');
            });

            it('detects if there is not leave animation and start the enter animation alone', function() {
                enter.setup(enterEl);
                testutils.ng.tick(1);
                expect(enterEl.prop("className")).toBe('fade in ui-page-active');
            });
        });
        describe('start', function () {
            var enterFinished, leaveFinished;
            beforeEach(function () {
                enterFinished = jasmine.createSpy('enterFinished');
                leaveFinished = jasmine.createSpy('leaveFinished');
            });
            it('calls the given callback if both animations are already complete', function () {
                var enterMemento = enter.setup(enterEl);
                var leaveMemento = leave.setup(leaveEl);
                fireNextAnimationEvent();
                fireNextAnimationEvent();
                enter.start(enterEl, enterFinished, enterMemento);
                expect(enterFinished).toHaveBeenCalled();
                leave.start(leaveEl, leaveFinished, leaveMemento);
                expect(leaveFinished).toHaveBeenCalled();
            });
            it('calls the given callback after both animations are complete', function () {
                var enterMemento = enter.setup(enterEl);
                var leaveMemento = leave.setup(leaveEl);
                enter.start(enterEl, enterFinished, enterMemento);
                leave.start(leaveEl, leaveFinished, leaveMemento);
                expect(enterFinished).not.toHaveBeenCalled();
                expect(leaveFinished).not.toHaveBeenCalled();

                fireNextAnimationEvent();
                expect(enterFinished).not.toHaveBeenCalled();
                expect(leaveFinished).not.toHaveBeenCalled();

                fireNextAnimationEvent();
                expect(enterFinished).toHaveBeenCalled();
                expect(leaveFinished).toHaveBeenCalled();
            });
        });
    });
    describe('none animation', function() {
        var enter, leave, enterEl, leaveEl, parentEl;
        beforeEach(function () {
            testutils.ng.enableTransitions(true);
            inject(function (jqmPageNoneEnterAnimation, jqmPageNoneLeaveAnimation) {
                enter = jqmPageNoneEnterAnimation;
                leave = jqmPageNoneLeaveAnimation;
                enterEl = angular.element('<div></div>');
                leaveEl = angular.element('<div class="ui-page-active"></div>');
                parentEl = angular.element('<div></div>').append(enterEl).append(leaveEl);
            });
        });
        describe('enter', function () {
            it('adds the correct classes', function () {
                enter.setup(enterEl);
                expect(enterEl.prop("className")).toBe('ui-page-active');
                expect(parentEl.prop("className")).toBe('');
            });

            it('removes the correct classes', function () {
                leave.setup(leaveEl);
                expect(leaveEl.prop("className")).toBe('');
            });
        });
        describe('start', function () {
            var enterFinished, leaveFinished;
            beforeEach(function () {
                enterFinished = jasmine.createSpy('enterFinished');
                leaveFinished = jasmine.createSpy('leaveFinished');
            });
            it('calls the given callback immediately', function () {
                enter.start(enterEl, enterFinished, null);
                expect(enterFinished).toHaveBeenCalled();
                leave.start(leaveEl, leaveFinished, null);
                expect(leaveFinished).toHaveBeenCalled();
            });
        });
    });
    describe('animation degradation', function() {
        describe('no 3d animations', function() {
            var enter, leave, enterEl, leaveEl, parentEl;
            beforeEach(function () {
                testutils.ng.enableTransitions("basic");
                inject(function (jqmPageSlideEnterAnimation, jqmPageSlideLeaveAnimation) {
                    enter = jqmPageSlideEnterAnimation;
                    leave = jqmPageSlideLeaveAnimation;
                    enterEl = angular.element('<div></div>');
                    leaveEl = angular.element('<div class="ui-page-active"></div>');
                    parentEl = angular.element('<div></div>').append(enterEl).append(leaveEl);
                });
            });
            it('uses the transition fallback', function() {
                expect(PAGE_ANIMATION_DEFS.slide.fallback).toBe('fade');
                enter.setup(enterEl);
                leave.setup(leaveEl);

                expect(parentEl.prop("className")).toBe('ui-mobile-viewport-transitioning viewport-fade');
                expect(enterEl.prop("className")).toBe('');
                expect(leaveEl.prop("className")).toBe('ui-page-active fade out');
            });
        });
        describe('no animations', function() {
            var enter, leave, enterEl, leaveEl, parentEl;
            beforeEach(function () {
                testutils.ng.enableTransitions(false);
                inject(function (jqmPageSlideEnterAnimation, jqmPageSlideLeaveAnimation) {
                    enter = jqmPageSlideEnterAnimation;
                    leave = jqmPageSlideLeaveAnimation;
                    enterEl = angular.element('<div></div>');
                    leaveEl = angular.element('<div class="ui-page-active"></div>');
                    parentEl = angular.element('<div></div>').append(enterEl).append(leaveEl);
                });
            });
            it('uses the none transition', function() {
                enter.setup(enterEl);
                leave.setup(leaveEl);

                expect(parentEl.prop("className")).toBe('');
                expect(enterEl.prop("className")).toBe('ui-page-active');
                expect(leaveEl.prop("className")).toBe('');
            });
        });
    });
});