var mod = angular.module("app", ["jqm"]);
mod.config(function($routeProvider) {
    $routeProvider.when("/", {
        redirectTo: "main.html"
    });
    $routeProvider.when("/index.html", {
        redirectTo: "main.html"
    });
    $routeProvider.when("/indexDev.html", {
        redirectTo: "main.html"
    });
    $routeProvider.when("/:page", {
        transition: 'slide',
        templateUrl: function(params) {
            return params.page;
        }
    });
    $routeProvider.when("/:folder/:page", {
        transition: 'slide',
        templateUrl: function(params) {
            return params.folder+"/"+params.page;
        }
    });
    $routeProvider.when("/features/transitions/:transition/demo.html", {
        transition: function(params) {
            return params.transition;
        },
        templateUrl: 'features/animationDemo.html'
    });
});
