jqmModule.directive('jqmPage', ['jqmTheme', function (jqmTheme) {
    return {
        restrict: 'A',
        link: function (scope, iElement) {
            var theme = jqmTheme(iElement);

            iElement.addClass('ui-page ui-body-' + theme);
            scope.$on('$viewContentLoaded', function () {
                // Modify the parent when this page is shown.
                iElement.parent().addClass("ui-overlay-" + theme);
            });
        }
    };
}]);
