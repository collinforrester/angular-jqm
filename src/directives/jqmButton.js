jqmModule.directive('jqmButton', function() {
  return {
    restrict: 'A',
    template: '<div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span"' +
      'data-theme="c" data-disabled="false" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c"'+
      ' aria-disabled="false">' +
      '<span class="ui-btn-inner"><span class="ui-btn-text">Button</span></span>' +
      '<button class="ui-btn-hidden" data-disabled="false"></button>' +
      '</div>',
    replace: true,
    compile: function(cElement) {
      // TODO: inherit correct theme
      // For now just using 'c'
      var theme = 'c';

      var hoverState = function(e) {
        cElement.toggleClass('ui-btn-hover-' + theme);
        cElement.toggleClass('ui-btn-up-' + theme);
      },
      pressState = function(e) {
        cElement.toggleClass('ui-btn-up-' + theme);
        cElement.toggleClass('ui-btn-down-' + theme);
      };

      cElement.bind('mousedown mouseup', pressState);
      cElement.bind('mouseenter mouseleave', hoverState);

    }
  };
});