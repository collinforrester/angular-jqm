jqmModule.directive('jqmTheme', ['jqmTheme', function (jqmTheme) {
    return {
        restrict: 'A',
        compile: function compile() {
            return {
                pre: function preLink(scope, iElement, iAttrs) {
                    // Set the theme before all other link functions of children
                    var theme = iAttrs.jqmTheme;
                    if (theme) {
                        jqmTheme(iElement, theme);
                    }
                }
            };
        }
    };
}]);
