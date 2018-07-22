angular.module("umbraco")
    .controller("Mooce.Slideshow",
    ['$scope', '$http', 'assetsService', 'dialogService', function ($scope, $http, assetsService, dialogService) {
        
        // assetsService.loadCss("/App_Plugins/styles.css");

        $scope.current = {
            backgroundUrl:'',
            heading:'',
            caption:'',
            action:''
        }

        $scope.pickPhoto = function(slide) {

            dialogService.mediaPicker({ onlyImages : true })
        }         
    }]);