/**
 * The cache that is used in `jqmCachingView`.
 */
jqmModule.factory("$jqmViewCache", ['$cacheFactory', function($cacheFactory) {
    return $cacheFactory('views');
}]);
