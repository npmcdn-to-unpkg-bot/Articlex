app.controller('EditorController', ['$scope', '$http', 'userinfo', '$location',
    function($scope, $http, userinfo, $location) {
        $scope.title = "";
        $scope.content = "";

        $scope.formData = {};
        $scope.submitForm = function() {
        $http({
          method  : 'POST',
          url     : 'http://chinnnoo.xyz:8889/api/article/uid/' + userinfo.getInfo().uid,
          data    : $.param($scope.formData),
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
          .success(function(data) {
            console.log("sent");
            $location.url("http://chinnnoo.xyz/#/");
            console.log("redirect to http://chinnnoo.xyz/#/");
          });
        };

        $scope.tinymceOptions = {
            onChange: function(e) {
                // put logic here for keypress and cut/paste changes
            },

            setup: function(editor) {

                editor.on('init', function() {
                    // Default classes of tinyMCE are a bit weird
                    // I add my own class on init
                    // this also sets the empty class on the editor on init
                    tinymce.DOM.addClass(editor.bodyElement, 'content-editor empty');
                });

                // You CAN do it on 'change' event, but tinyMCE sets debouncing on that event
                // so for a tiny moment you would see the placeholder text and the text you you typed in the editor
                // the selectionchange event happens a lot more and with no debouncing, so in some situations
                // you might have to go back to the change event instead.
                editor.on('selectionchange', function() {
                    if (editor.getContent() === "") {
                        tinymce.DOM.addClass(editor.bodyElement, 'empty');
                    } else {
                        tinymce.DOM.removeClass(editor.bodyElement, 'empty');
                    }
                });
            },
            inline: true,
            menubar: false,
            toolbar: 'styleselect | bold italic | link image',
            plugins: 'advlist autolink link image lists charmap',
            skin: 'lightgray',
            theme: 'modern'
        };

        $scope.$on('$routeChangeSuccess', function() {
            console.log("Scrolled to the top of the article");
            window.scrollTo(0, 0);
        });
        $scope.$on('$viewContentLoaded', function(){
          //Here your view content is fully loaded !!
          NProgress.done();
        });
    }
]);
