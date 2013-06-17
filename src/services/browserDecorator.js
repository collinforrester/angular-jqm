jqmModule.config(['$provide', function ($provide) {
    $provide.decorator('$browser', ['$delegate', browserHashReplaceDecorator]);
    $provide.decorator('$browser', ['$delegate', '$history', browserHistoryDecorator]);
    return;

    // ---------------
    // implementation functions
    function browserHashReplaceDecorator($browser) {
        // On android and non html5mode, the hash in a location
        // is returned as %23.
        var _url = $browser.url;
        $browser.url = function () {
            var res = _url.apply(this, arguments);
            if (arguments.length === 0) {
                res = res.replace(/%23/g, '#');
                res = res.replace(/ /g, '%20');
            }
            return res;
        };
        return $browser;
    }

    // Integrates $browser with $history.
    function browserHistoryDecorator($browser, $history) {
        var _url = $browser.url;
        $browser.onUrlChange($history.onUrlChangeBrowser);

        $browser.url = function (url, replace) {
            if (url) {
                // setter
                var res = _url.call(this, url, replace);
                $history.onUrlChangeProgrammatically(url, replace);
                return res;
            } else {
                // getter
                return _url.apply(this, arguments);
            }
        };
        return $browser;
    }
}]);