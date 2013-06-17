jqmModule.directive('html', function() {
    return {
        restrict: 'E',
        compile: function(cElement) {
            cElement.addClass("ui-mobile");
        }
    };
});
