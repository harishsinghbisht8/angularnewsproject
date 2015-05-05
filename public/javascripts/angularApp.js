var app = angular.module('flapperNews', ['ui.router']);

app.config(['$stateProvider',
            '$urlRouterProvider',
            function ($stateProvider,
    $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['posts', function (posts) {
            return posts.getAll();
          }]
        }
      })
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostCtrl'
      });

    $urlRouterProvider.otherwise('home');
            }]);
app.controller('MainCtrl', ['$scope', 'posts', function ($scope, posts) {
  $scope.test = 'flapperNews';
  $scope.posts = posts.posts;
  $scope.addPost = function () {
    if (!$scope.title || $scope.title === '' || !$scope.link || $scope.title === '') {
      return;
    }
    $scope.posts.push({
      title: $scope.title,
      link: $scope.link,
      upvotes: 0,
      comments: []
    });
    $scope.title = '';
    $scope.link = '';
  };

  $scope.incrementUpvotes = function (post) {
    post.upvotes++;
  };

}]);

app.controller('PostCtrl', ['$scope', '$stateParams', 'posts', function ($scope, $stateParams, posts) {
  $scope.post = posts.posts[$stateParams.id];

  $scope.addComment = function () {
    if (!$scope.body || $scope.body === '' || !$scope.author || $scope.author === '') {
      return;
    }
    $scope.post.comments.push({
      author: $scope.author,
      body: $scope.body,
      upvotes: 0
    });
    $scope.body = '';
  };

  $scope.incrementUpvotes = function (comment) {
    comment.upvotes++;
  };
}])

app.factory('posts', ['$http', function ($http) {
  var o = {};

  o.getAll = function () {
      return $http.get('/posts').success(function (data) {
        angular.copy(data, o.posts)
      })
    }
    /*o.posts = [
        {
          title: 'post 1',
          upvotes: 5,
          comments: [
            {
              author: 'Joe',
              body: 'Cool post!',
              upvotes: 0
            },
            {
              author: 'Bob',
              body: 'Great idea but everything is wrong!',
              upvotes: 0
            }
    ]
      },
        {
          title: 'post 2',
          upvotes: 2,
          comments: [
            {
              author: 'Joe',
              body: 'Cool post!',
              upvotes: 0
            },
            {
              author: 'Bob',
              body: 'Great idea but everything is wrong!',
              upvotes: 0
            }
    ]
      },
        {
          title: 'post 3',
          upvotes: 15,
          comments: [
            {
              author: 'Joe',
              body: 'Cool post!',
              upvotes: 0
            },
            {
              author: 'Bob',
              body: 'Great idea but everything is wrong!',
              upvotes: 0
            }
    ]
      },
        {
          title: 'post 4',
          upvotes: 9,
          comments: [
            {
              author: 'Joe',
              body: 'Cool post!',
              upvotes: 0
            },
            {
              author: 'Bob',
              body: 'Great idea but everything is wrong!',
              upvotes: 0
            }
    ]
      },
        {
          title: 'post 5',
          upvotes: 4,
          comments: [
            {
              author: 'Joe',
              body: 'Cool post!',
              upvotes: 0
            },
            {
              author: 'Bob',
              body: 'Great idea but everything is wrong!',
              upvotes: 0
            }
    ]
      }
                  ];*/
  return o;
}]);
