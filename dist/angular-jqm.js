/*! angular-jqm - v0.0.1-SNAPSHOT - 2013-06-06
 * https://github.com/opitzconsulting/angular-jqm
 * Copyright (c) 2013 OPITZ CONSULTING GmbH; Licensed MIT */
(function(angular) {
    "use strict";
var jqmModule = angular.module("jqm", []);
jqmModule.directive('jqmPage', function() {
    return {
        restrict: 'A',
        compile: function(cElement) {
            // TODO: ui-body-c: Theming should be customizable!
            cElement.addClass("ui-page ui-body-c");
        }
    };
});
/* globals jqmModule, angular */
function jqmButtonDirective() {
  var WRAPPERATTRIBUTE = 'jqm-wrapper';

  var link = function(scope, elm) {
      var wrapperAttr = elm.parent().attr(WRAPPERATTRIBUTE);
      if(wrapperAttr !== undefined) {
        var theme = 'c';

        var hoverState = function() {
          elm.toggleClass('ui-btn-hover-' + theme);
          elm.toggleClass('ui-btn-up-' + theme);
        },
        pressState = function() {
          elm.toggleClass('ui-btn-up-' + theme);
          elm.toggleClass('ui-btn-down-' + theme);
        };

        elm.bind('mousedown mouseup', pressState);
        elm.bind('mouseenter mouseleave', hoverState);
      }
    };
  return {
    restrict: 'E',
    compile: function(element, attrs) {
      var wrapperAttr = element.parent().attr(WRAPPERATTRIBUTE);

      if(wrapperAttr !== undefined ) {
        var btnParentClasses = 'ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c',
            label = element[0].value || element[0].innerText || '';


        // not 100% on this yet on how this should be handled
        // not being used yet
        var addAttributes = function(newElement) {
          for(var attr in attrs) {
            if(attr.indexOf('$')) {
              newElement.attr(attr, attrs[attr]);
            }
          }
          if (attrs.ngClick) {
            newElement.attr("ng-click", attrs.ngClick);
            attrs.$set("ngClick", null);
          }
          return newElement;
        };

        // nested spans are the same between both elements and can share this
        var compileSpans = function(label) {
           return '<span class="ui-btn-inner"><span class="ui-btn-text">'+label+'</span></span>';
        };

        var compileButton = function() {
          // btn element needs a wrapper div that gets the
          // btnParentClasses defined above
          var wrapperDiv = angular
            .element('<div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" data-disabled="false" aria-disabled="false"/>')
            .addClass(btnParentClasses);
          var btn = angular.element(element[0].outerHTML);

          btn.addClass('ui-btn-hidden');

          var newEl = angular
                        .element(wrapperDiv)
                        .append(compileSpans(label))
                        .append(btn);

          element.replaceWith(newEl);
        };
        var compileAnchor = function() {
          // <a href="#" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c">
          //   <span class="ui-btn-inner">
          //     <span class="ui-btn-text">Anchor</span>
          //   </span>
          // </a>

          // since anchor tag isn't wrapped,
          // pretty straightfoward: clear the text,
          // and build the element
          element.text('');
          var anchorBtn = angular
            .element(element[0].outerHTML)
            .addClass(btnParentClasses)
            .append(compileSpans(label));

          element.replaceWith(anchorBtn);
        };
        // Since the markup for the two is slightly different, approach them differently
        if(element[0].tagName === 'BUTTON' || element[0].tagName === 'INPUT') {
          compileButton();
        } else if(element[0].tagName === 'A' && element.attr('data-role') === 'button') {
          compileAnchor();
        }
        return link;
      }
    }
  };
}

jqmModule.directive('input', jqmButtonDirective);
jqmModule.directive('a', jqmButtonDirective);
jqmModule.directive('button', jqmButtonDirective);})(angular);