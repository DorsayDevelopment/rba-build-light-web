app.controller('SingleLightController', function($scope, $routeParams, $http, $timeout, $location, config) {
  const url = config.apiUrl + ':' + config.apiPort + '/api';

  $('.half-page').css('width', '0%');
  $('#light-projects').css('width', '100%');
  $timeout(function() {
    $('.half-page').css('width', '50%');
    $('.half-page').css('width', '');
  }, 0);

  $scope.light;
  $scope.projects;

  $scope.selectProject = function(index) {
    $scope.projects[index].selected = !$scope.projects[index].selected;
  };

  $scope.updateLight = function() {
    var projectsToSave = [];
    for(var p in $scope.projects) {
      if($scope.projects[p].selected) {
        projectsToSave.push($scope.projects[p]._id);
      }
    }
    console.log(projectsToSave);

    var data = {
      name: $scope.light.name,
      ip: $scope.light.ip,
      projects: projectsToSave
    };
    $http.patch(url + '/lights/' + $routeParams.id, data, null).then(
      function(response) {
        console.log('light updated');
        $scope.notifyLight();
      },
      function(err) {
        console.log('error');
      }
    );
  };

  $scope.deleteLight = function() {
    $http.delete(url + '/lights/' + $routeParams.id, null).then(
      function(response) {
        $timeout(function() {
          $location.path('/lights');
        }, 500);
      },
      function(err) {

      }
    )
  };

  $scope.changeColor = function(color) {
    $http.get('http://' + $scope.light.ip + '/api/manual/changeColor/' + color).then(
      function(response) {
        console.log('light manually set to ' + color);
      },
      function(response) {
        console.log(response);
      }
    )
  }

  $scope.fetchProjects = function() {
    $scope.projects = [];
    $http.get(url + '/projects/', null).then(
      function(response) {
        for(var p in response.data)
          if($scope.light.projects != null && $scope.light.projects.indexOf(response.data[p]._id) > -1)
            response.data[p].selected = true;
        $scope.projects = response.data;
      },
      function(response) {
        console.log('error');
      }
    );
  };

  $scope.notifyLight = function() {
    console.log(url + '/lights/' + $routeParams.id + '/notify');
    $http.post(url + '/lights/' + $routeParams.id + '/notify', null).then(
      function(response) {
        console.log('notify light ' + $routeParams.id + ' of all subscribed projects');
      },
      function(response) {
        console.log('error');
      }
    );
  };
  

  $scope.fetchLight = function() {
    $scope.light = null;
    $http.get(url + '/lights/' + $routeParams.id, null).then(
      function(response) {
        $scope.light = response.data;
        console.log($scope.light);
        $scope.fetchProjects();
      },
      function(response) {
        console.log('error');
      }
    );
  };
  $scope.fetchLight();

});