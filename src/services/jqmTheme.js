jqmModule.provider('jqmTheme', function () {
    var JQM_THEME = '$jqmTheme',
        _defaultTheme = 'c';

    return {
        $get: jqmThemeFactory,
        defaultTheme: defaultTheme
    };

    function defaultTheme(value) {
        if (value) {
            _defaultTheme = value;
        }
        return _defaultTheme;
    }

    function jqmThemeFactory() {
        return jqmTheme;
    }

    function jqmTheme(element, value) {
        if (arguments.length === 2) {
            if (value) {
                element.data(JQM_THEME, value);
            } else {
                element.removeData(JQM_THEME);
            }
        }
        return element.inheritedData(JQM_THEME) || _defaultTheme;
    }
});