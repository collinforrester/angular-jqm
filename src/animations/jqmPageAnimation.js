var PAGE_ANIMATION_DEFS = {
    none: {
        sequential: true,
        fallback: 'none'
    },
    slide: {
        sequential: false,
        fallback: 'fade'
    },
    fade: {
        sequential: true,
        fallback: 'fade'
    },
    pop: {
        sequential: true,
        fallback: 'fade'
    },
    slidefade: {
        sequential: true,
        fallback: 'fade'
    },
    slidedown: {
        sequential: true,
        fallback: 'fade'
    },
    slideup: {
        sequential: true,
        fallback: 'fade'
    },
    flip: {
        sequential: true,
        fallback: 'fade'
    },
    turn: {
        sequential: true,
        fallback: 'fade'
    },
    flow: {
        sequential: true,
        fallback: 'fade'
    }
};

registerPageAnimations(PAGE_ANIMATION_DEFS);

function registerPageAnimations(animations) {
    var type;
    for (type in animations) {
        registerPageAnimation(type, false, 'enter');
        registerPageAnimation(type, true, 'enter');
        registerPageAnimation(type, false, 'leave');
        registerPageAnimation(type, true, 'leave');
    }
}

function registerPageAnimation(transitionType, reverse, direction) {
    var ngName = "jqmPage-" + transitionType;

    if (reverse) {
        ngName += "-reverse";
    }
    ngName += "-" + direction;

    jqmModule.animation(ngName, ['$animationComplete', '$sniffer', function (animationComplete, $sniffer) {
        var degradedTransitionType = maybeDegradeTransition(transitionType),
            activePageClass = "ui-page-active",
            toPreClass = "ui-page-pre-in",
            addClasses = degradedTransitionType + (reverse ? " reverse" : ""),
            removeClasses = "out in reverse " + degradedTransitionType,
            viewPortClasses = "ui-mobile-viewport-transitioning viewport-" + degradedTransitionType,
            transitionDef = PAGE_ANIMATION_DEFS[degradedTransitionType];

        if (degradedTransitionType === 'none') {
            return {
                setup: setupNone,
                start: startNone
            };
        } else {
            if (direction === "leave") {
                addClasses += " out";
                removeClasses += " " + activePageClass;
                return {
                    setup: setupLeave,
                    start: start
                };
            } else {
                addClasses += " in " + activePageClass + " " + toPreClass;
                return {
                    setup: setupEnter,
                    start: start
                };
            }
        }

        // --------------

        function setupNone(element) {
            element = firstElement(element);
            if (direction === "leave") {
                element.removeClass(activePageClass);
            } else {
                element.addClass(activePageClass);
            }
        }

        function startNone(element, done) {
            done();
        }

        function setupEnter(element) {
            var synchronization;
            element = firstElement(element);
            synchronization = createSynchronizationIfNeeded(element);
            synchronization.enter(function(done) {
                // -----------
                // This code is from jquery mobile 1.3.1, function "createHandler".
                // Prevent flickering in phonegap container: see comments at #4024 regarding iOS
                element.css("z-index", -10);
                element.addClass(addClasses);
                // Restores visibility of the new page: added together with $to.css( "z-index", -10 );
                element.css("z-index", "");
                element.removeClass(toPreClass);
                // ------------
                animationComplete(element, function() {
                    element.removeClass(removeClasses);
                    done();
                });
            });
            return synchronization;
        }

        function setupLeave(element) {
            var synchronization;
            element = firstElement(element);
            synchronization = createSynchronizationIfNeeded(element);
            synchronization.leave(function(done) {
                element.addClass(addClasses);
                animationComplete(element, function() {
                    element.removeClass(removeClasses);
                    done();
                });
            });
            return synchronization;
        }

        function start(element, done, synchronization) {
            synchronization.bindEnd(done);
        }

        function createSynchronizationIfNeeded(el) {
            var parent = el.parent(),
                sync = parent.data("animationSync");
            if (!sync) {
                if (transitionDef.sequential) {
                    sync = sequentialSynchronization();
                } else {
                    sync = parallelSynchronization();
                }
                sync.bindStart(function() {
                    parent.addClass(viewPortClasses);
                });
                sync.bindEnd(function() {
                    parent.removeClass(viewPortClasses);
                    parent.data("animationSync", null);
                });
                parent.data("animationSync", sync);
            }
            return sync;
        }

        function firstElement(element) {
            var i;
            for (i = 0; i < element.length; i++) {
                if (element[i].nodeType === 1) {
                    return element.eq(i);
                }
            }
            return angular.element();
        }

        function maybeDegradeTransition(transition) {
            if (!$sniffer.cssTransform3d) {
                // Fall back to simple transition in browsers that don't support
                // complex 3d animations.
                transition = PAGE_ANIMATION_DEFS[transition].fallback;
            }
            if (!$sniffer.animations) {
                transition = "none";
            }
            return transition;
        }
    }]);

    function parallelSynchronization() {
        var start = latch(),
            end = latch(),
            runningCount = 0;
        return {
            enter: enter,
            leave: leave,
            bindStart: start.listen,
            bindEnd: end.listen
        };

        function enter(delegate) {
            setup(delegate);
        }

        function leave(delegate) {
            setup(delegate);
        }

        function setup(delegate) {
            start.notify();
            runningCount++;
            delegate(function () {
                runningCount--;
                if (runningCount === 0) {
                    end.notify();
                }
            });
        }

    }

    function sequentialSynchronization() {
        var start = latch(),
            end = latch(),
            enterDelegate,
            leaveDelegate;
        return {
            enter: enter,
            leave: leave,
            bindStart: start.listen,
            bindEnd: end.listen
        };

        function enter(delegate) {
            enterDelegate = delegate;
            start.notify();
            // setTimeout as the leave animation
            // to detect if a leave animation has been used.
            window.setTimeout(function () {
                if (!leaveDelegate) {
                    enterDelegate(function () {
                        end.notify();
                    });
                }
            }, 0);
        }

        function leave(delegate) {
            leaveDelegate = delegate;
            start.notify();
            delegate(function () {
                if (enterDelegate) {
                    enterDelegate(function () {
                        end.notify();
                    });
                } else {
                    end.notify();
                }
            });
        }
    }

    function latch() {
        var _listeners = [],
            _notified = false;
        return {
            listen: listen,
            notify: notify
        };

        function listen(callback) {
            if (_notified) {
                callback();
            } else {
                _listeners.push(callback);
            }
        }

        function notify() {
            if (_notified) {
                return;
            }
            var i;
            for (i = 0; i < _listeners.length; i++) {
                _listeners[i]();
            }
            _notified = true;
        }
    }
}

