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
          postPromise: ['posts',
                        function (posts) {
              return posts.getAll();
                        }
                    ]
        }
      })
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostCtrl',
        resolve: {
          post: ['$stateParams', 'posts',
                        function ($stateParams, posts) {
              return posts.get($stateParams.id);
                        }
                    ]
        }
      });

    $urlRouterProvider.otherwise('home');
    }
]);
app.controller('MainCtrl', ['$scope', 'posts',
    function ($scope, posts) {
    $scope.test = 'flapperNews';
    $scope.posts = posts.posts;
    $scope.addPost = function () {
      if (!$scope.title || $scope.title === '') {
        return;
      }
      posts.create({
        title: $scope.title,
        link: $scope.link,
      });
      $scope.title = '';
      $scope.link = '';
    };
    $scope.incrementUpvotes = function (post) {
      posts.upvote(post);
    };

    }
]);

app.controller('PostCtrl', ['$scope', '$stateParams', 'posts', 'post',
    function ($scope, $stateParams, posts, post) {
    $scope.post = post;

    $scope.addComment = function () {
      if ($scope.body === '') {
        return;
      }
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user',
      }).success(function (comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };

    $scope.incrementUpvotes = function (comment) {
      posts.upvoteComment(post, comment);
    };
    }
]);

app.factory('posts', ['$http',
    function ($http) {
    var o = {};

    o.getAll = function () {
      return $http.get('/posts').success(function (data) {
        //angular.copy(o.posts, data)
        o.posts = data;
      })
    };

    o.create = function (post) {
      return $http.post('/posts', post).success(function (data) {
        o.posts.push(data);
      });
    };

    o.upvote = function (post) {
      return $http.post('/posts/' + post._id + '/upvote').success(function (data) {
        post.upvotes++;
      })
    }

    o.get = function (id) {
      return $http.get('/posts/' + id).then(function (res) {
        return res.data;
      });
    };

    o.addComment = function (id, comment) {
      return $http.post('/posts/' + id + '/comments', comment);
    };

    o.upvoteComment = function (post, comment) {
      return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
        .success(function (data) {
          comment.upvotes += 1;
        });
    };
    return o;
    }
]);

app.factory('auth', ['$window', function ($window) {
  var auth = {};

  auth.setToken = function (token) {
    $window.localStorage['flapper-news-token'] = token;
  };

  auth.gerToken = function () {
    return $window.localStorage['flapper-news-token'];
  };

  auth.isLoggedIn = function () {
    var token = auth.getToken();
    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };
  return auth;
}]);
