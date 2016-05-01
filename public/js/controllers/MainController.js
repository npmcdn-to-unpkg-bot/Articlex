app.controller('MainController',[
  '$scope',
  '$http',
  'articles',
  'userinfo',
  function($scope, $http, articles, userinfo) {

  articles.success(function(data) {
    $scope.articles = data;
    $scope.userImage = "https://image.freepik.com/free-icon/user-male-shape-in-a-circle--ios-7-interface-symbol_318-39025.png";
    $scope.loves = 50;
    console.log(userinfo.getInfo());

  });

  $scope.$on('$viewContentLoaded', function(){
    //Here your view content is fully loaded !!
    NProgress.done();
  });

}]);