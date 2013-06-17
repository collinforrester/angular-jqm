/**
 * This directive is very similar to ngViewDirective.
 * However, it allows to cache views including their scopes using the `jqmViewCache`.
 * <p>
 * For this to work the semantics of routes were changed a little:
 *
 * 1. If a route for a cached template is activated, the template and it's scope are taken from the cache.
 *    If the template is not yet cached, it is compiled and then added to the cache.
 * 2. If a route is left, it's scope is disconnected, if it's activated, the scope gets reconnected.
 * 3. All templates that are in `$templateCache` are compiled with a new disconnected scope
 *    when this directive is created.
 * 4. Route controllers are created only on the first time it's route is activated.
 *    Afterwards, they may listen to the `$viewContentLoaded` to be notified that
 *    their route is activated again.
 * <p>
 * Implementation notes:
 *
 * - controllers are not instantiated on startup but on the first matching route, as it's not easy
 *   to determine them from the routes in advance, as routes may use default routes, functions for the
 *   `templateUrl` property, ...
 */
jqmModule.directive('jqmCachingView', ['$jqmViewCache', '$templateCache', '$route', '$anchorScroll', '$compile',
    '$controller', '$animator',
    function (jqmViewCache, $templateCache, $route, $anchorScroll, $compile, $controller, $animator) {
        return {
            restrict: 'ECA',
            terminal: true,
            link: function (scope, element, attr) {
                precompileTemplateCache();

                var lastScope,
                    onloadExp = attr.onload || '',
                    animate = $animator(scope, attr);

                scope.$on('$routeChangeSuccess', update);
                update();


                function destroyLastScope() {
                    if (lastScope) {
                        lastScope.$disconnect();
                        lastScope = null;
                    }
                }

                function clearContent() {

                    var contents = element.contents();
                    contents.remove = detachNodes;
                    animate.leave(contents, element);
                    destroyLastScope();

                    // Note: element.remove() would
                    // destroy all data associated to those nodes,
                    // e.g. widgets, ...
                    function detachNodes() {
                        /*jshint -W040:true*/
                        var i, node, parent;
                        for (i=0; i<this.length; i++) {
                            node = this[i];
                            parent = node.parentNode;
                            if (parent) {
                                parent.removeChild(node);
                            }
                        }
                    }
                }

                function update() {
                    var locals = $route.current && $route.current.locals,
                        template = locals && locals.$template;

                    if (template) {
                        clearContent();
                        var current = $route.current,
                            controller,
                            cacheEntry = compileTemplateIfNeeded(current.loadedTemplateUrl, template);

                        animate.enter(cacheEntry.elements, element);
                        lastScope = current.scope = cacheEntry.scope;
                        lastScope.$reconnect();
                        if (current.controller) {
                            controller = cacheEntry.controller;
                            locals.$scope = lastScope;
                            if (!controller) {
                                controller = cacheEntry.controller = $controller(current.controller, locals);
                                if (current.controllerAs) {
                                    lastScope[current.controllerAs] = controller;
                                }
                                element.children().data('$ngControllerController', controller);
                            }
                        }
                        lastScope.$emit('$viewContentLoaded');
                        lastScope.$eval(onloadExp);
                        // $anchorScroll might listen on event...
                        $anchorScroll();
                    } else {
                        clearContent();
                    }
                }

                function precompileTemplateCache() {
                    var urls = $templateCache.keys();
                    angular.forEach(urls, function (url) {
                        var template, ctrlFn;
                        template = $templateCache.get(url);
                        compileTemplateIfNeeded(url, template);
                    });
                }

                function compileTemplateIfNeeded(templateUrl, template) {
                    var enterElements, link, childScope,
                        locals = {},
                        cacheEntry;

                    cacheEntry = jqmViewCache.get(templateUrl);
                    if (!cacheEntry) {
                        enterElements = angular.element('<div></div>').html(template).contents();
                        link = $compile(enterElements);

                        childScope = scope.$new();
                        childScope.$disconnect();
                        link(childScope);
                        cacheEntry = {
                            elements: enterElements,
                            scope: childScope
                        };
                        if (templateUrl) {
                            jqmViewCache.put(templateUrl, cacheEntry);
                        }
                    }
                    return cacheEntry;
                }
            }
        };
    }]);