angular.module('marketplace').directive('triggerChange', function ($sniffer) {
    return {
        link : function(scope, elem, attrs) {
            elem.bind('click', function(){
                $(attrs.triggerChange).trigger($sniffer.hasEvent('input') ? 'input' : 'change');
            });
        },
        priority : 1
    };
});