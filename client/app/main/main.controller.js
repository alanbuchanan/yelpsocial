'use strict';

angular.module('yelpsocialApp')
  .controller('MainCtrl', function ($scope, $http, Auth, $mdDialog) {

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.bars = [];
    $scope.isLoading = false;
    $scope.nowtFound = false;

    // Get list of bars from Yelp API depending on user's search
    $scope.search = function (place) {
      $scope.nowtFound = false;
      $scope.isLoading = true;
      $http.get('/api/bars/' + place).success(function (data) {
        $scope.isLoading = false;
        $scope.bars = data.businesses;

        // Get numbers for 'going' button
        $scope.bars.forEach(function (bar, index) {
          $http.get('/api/confirmations/' + bar.id).success(function (data) {
            $scope.bars[index].attendees = data.attendees;
          }).error(function (err) {
            $scope.bars[index].attendees = [];
          })
        });

      }).error(function (err) {
        // User typed in a place that can't be found by API
        $scope.bars = [];
        $scope.isLoading = false;
        $scope.nowtFound = true;
      });
    };

    var originatorEv;
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    // User has clicked on a 'going' button, update DB
    $scope.confirm = function (index) {

      originatorEv = null;

      var bar = $scope.bars[index];

      function dialog(title, content) {
        $mdDialog.show(
          $mdDialog.alert()
            .targetEvent(originatorEv)
            .clickOutsideToClose(true)
            .parent('body')
            .title(title)
            .content(content)
            .ok('OK')
        );
      }

      if (!isGoing(index)) {
        dialog('See you there', 'You confirmed for your chosen bar!');
        $http.post('/api/confirmations/' + bar.id + '/' + Auth.getCurrentUser()._id)
          .success(function (data) {
            bar.attendees = data.attendees;
          })
      } else {
        dialog('Maybe next time', 'You cancelled for your chosen bar!');
        cancelConfirmation(index);
      }
    };

    // Check if user is going
    var isGoing = function (index) {
      return $scope.bars[index].attendees &&
        $scope.bars[index].attendees.indexOf(Auth.getCurrentUser()._id) !== -1;
    };

    // If user has confirmed and clicks button again, they cancel their confirmation
    var cancelConfirmation = function (index) {
      $scope.confirmationCancelled = true;
      var bar = $scope.bars[index];

      $http.put('/api/confirmations/' + bar.id + '/' + Auth.getCurrentUser()._id).
        success(function (data) {
          bar.attendees = data.attendees;
        });
    };
  })
  .config(function ($mdThemingProvider) {
    // Colours
    $mdThemingProvider.theme('default')
      .primaryPalette('deep-purple')
      .accentPalette('orange');
  });


