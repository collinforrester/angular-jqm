jqmModule.factory('$animationComplete', ['$sniffer', function ($sniffer) {
    return function (el, callback) {
        var eventNames = 'animationend';
        if (!$sniffer.animations) {
            throw new Error("Browser does not support css animations.");
        }
        if ($sniffer.vendorPrefix) {
            eventNames += " " + $sniffer.vendorPrefix.toLowerCase() + "AnimationEnd";
        }
        el.bind(eventNames, callback);
    };
}]);
