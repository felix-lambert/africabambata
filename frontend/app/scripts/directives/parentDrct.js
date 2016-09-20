angular.module('marketplace').directive('myParent', function () {
    return {
        restrict:'E',
        scope:{
            delete: '&',
            foods: '='
        },
        link:function (scope, element, attrs) {
            var $el = $(element);

            $el.hide().fadeIn('slow');

            $('.thumbnails').sortable({
                placeholder:"ui-state-highlight", forcePlaceholderSize:true
            });
        }
    };
});