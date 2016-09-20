angular.module('marketplace').factory('Delay', Delay);

Delay.$inject = ['$q', '$timeout'];

function Delay($q, $timeout) {

    var Delay = {
        start: start
    };

    return Delay;

    function start() {
        var deferred = $q.defer();
        $timeout(deferred.resolve, 100);
        return deferred.promise;
    }
}