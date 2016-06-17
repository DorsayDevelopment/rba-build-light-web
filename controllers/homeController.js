app.controller('HomeController', function($scope, $location, $timeout) {
  $scope.home = "Home controller";

  $scope.goto = function(path) {
    $('.half-page').css('width', '0%');
    $('#' + path).css('width', '100%');
    $timeout(function() {
      console.log(path);
      $location.path(path);
    }, 500);
  }
});