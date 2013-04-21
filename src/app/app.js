'use strict';
//########################################################################
var app = angular.module('editor', []);
//########################################################################
//###################START MainCtrl#######################################
app.controller('MainCtrl', ['$scope', 'Options', '$document', function($scope, Options, $document){
  var oDoc, sDefTxt, switchMode;
  Options.Formats.then(function(data){
    $scope.formatOptions = data;
  });
  Options.FontFamily.then(function(data){
    $scope.fontFamilyOptions = data;
  });
  Options.FontSize.then(function(data){
    $scope.fontSizeOptions = data;
  });
  Options.Colors.then(function(data){
    $scope.colors = data;
  });
  $scope.selected   = true;
  $scope.state      = "";
  $scope.initDoc    = function(){
//    console.log("azerty");
    oDoc           = $document[0].getElementById("textBox");
    switchMode     = $document[0].getElementById("switchBox");
//    sDefTxt        = oDoc.innerHTML;
    $scope.docMode = "Show HTML";
    console.log(oDoc);
    console.log(switchMode);
//    if(switchMode.checked){
//      $scope.setDocMode(true);
//    }
  };
//  $scope.$on('load', $scope.initDoc);
  $scope.formatDoc  = function(sCmd){
    if(validateMode()){
      document.execCommand(sCmd, false, $scope.format);
      oDoc.focus();
    }
  };
  var validateMode  = function(){
    if(!switchMode.checked){
      return true ;
    }
    alert("Uncheck \"Show HTML\".");
    oDoc.focus();
    return false;
  };
  $scope.setDocMode = function(bToSource){
    var oContent;
    oDoc = $document[0].getElementById('textBox');
    if(bToSource === "Show HTML"){
      oContent             = document.createTextNode(oDoc.innerHTML);
      oDoc.innerHTML       = "";
      var oPre             = document.createElement("pre");
      oDoc.contentEditable = false;
      oPre.id              = "sourceText";
      oPre.contentEditable = true;
      oPre.appendChild(oContent);
      oDoc.appendChild(oPre);
      $scope.state         = "active";
      oDoc.style.padding   = "0";
      oPre.focus();
    }else{
      if(document.all){
        oDoc.innerHTML = oDoc.innerText;
      }else{
        oContent       = document.createRange();
        oContent.selectNodeContents(oDoc.firstChild);
        oDoc.innerHTML = oContent.toString();
      }
      oDoc.contentEditable = true;
      $scope.state         = "";
      oDoc.style.padding   = "12px";
      oDoc.focus();
    }
  };
  var printDoc      = function() {
    if(!validateMode()){
      return;
    }
    var oPrntWin = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
    oPrntWin.document.open();
    oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
    oPrntWin.document.close();
  }
  var revertToRegularView = function(){
    $scope.setDocMode('Hide HTML');
  }
}]);
//###################END MainCtrl#########################################
//########################################################################
/*
bsButtonSelect from angular-strap http://mgcrea.github.io/angular-strap/
The MIT License

Copyright (c) 2012 Olivier Louvignes http://olouv.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
//########################################################################
//#################START bsButtonSelect directive#########################
app.directive('bsButtonSelect', ['$parse', '$timeout', function($parse, $timeout) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, ctrl) {
      var getter = $parse(attrs.bsButtonSelect),
      setter     = getter.assign;
      if(ctrl) {
        element.text(scope.$eval(attrs.ngModel));
        scope.$watch(attrs.ngModel, function(newValue, oldValue) {
          element.text(newValue);
        });
      }
      var values, value, index, newValue;
      element.bind('click', function(ev) {
        values   = getter(scope);
        value    = ctrl ? scope.$eval(attrs.ngModel) : element.text();
        index    = values.indexOf(value);
        newValue = index > values.length - 2 ? values[0] : values[index + 1];
        console.warn(values, newValue);
        scope.$apply(function() {
          element.text(newValue);
          if(ctrl) {
            ctrl.$setViewValue(newValue);
          }
        });
      });
    }
  };
}]);
//###################END bsButtonSelect directive#########################
//########################################################################
//########################################################################
//###################START editor#########################################
app.directive('editor', ['$document', function($document) {
  var linker = function(scope, element, attrs){
    scope.changeId = function(){
      while($document[0].querySelector('#textBox') !== null){
        $document[0].querySelector('#textBox').id = "";
      }
      element[0].id = "textBox";
    };
  };
  return {
    scope:    {
      setDocMode: "&"
    },
    restrict: "E",
    replace:  true,
    link:     linker,
    templateUrl: "assets/tpls/editor_directive.tpl.html"
  };
}]);
//#####################END editor#########################################
//########################################################################
//###################START Options service################################
app.factory('Options', ['$http', function($http){
  var Url            = {};
  var Options        = {};
  Url.Formats        = "json_files/format_items.json";
  Url.FontFamily     = "json_files/font_family.json";
  Url.FontSize       = "json_files/font_size.json"
  Url.Colors         = "json_files/colors.json"
  Options.Formats    = $http.get(Url.Formats).then(function(response){
    return response.data;
  });
  Options.FontFamily = $http.get(Url.FontFamily).then(function(response){
    return response.data;
  });
  Options.FontSize   = $http.get(Url.FontSize).then(function(response){
    return response.data;
  });
  Options.Colors     = $http.get(Url.Colors).then(function(response){
    return response.data;
  });
  return Options;
}]);
//###################END Options service##################################
//########################################################################
