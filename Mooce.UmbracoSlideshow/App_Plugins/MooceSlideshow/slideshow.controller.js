angular.module("umbraco")
    .controller("Mooce.Slideshow",
    ['$scope', '$http', 'assetsService', 'dialogService', function ($scope, $http, assetsService, dialogService) {
        
        // assetsService.loadCss("/App_Plugins/styles.css");

        $scope.model.value = Object.assign($scope.model.value, {
            slideDuration : 1000,
            slides : []
        })



        $scope.current = {
            index : 0,
            backgroundUrl:'',
            heading:'',
            caption:'',
            link:''
        }

        $scope.getAllSlides = function() {

            return $scope.model.value.slides
        }

        $scope.getCurrentSlide = function() {

            return $scope.current
        }

        $scope.deleteSlide = function($event, slide) {
            $event.preventDefault();

            var value = $scope.model.value;
            var index = value.slides.indexOf(slide);

            if(index !== -1) {
                value.slides.splice(index, 1)
            }


        }

        $scope.addSlide = function($event) {
            $event.preventDefault();
            $scope.model.value.slides.push({
                index : $scope.model.value.slides.length,
                backgroundUrl:'',
                heading:'',
                caption:'',
                link:''
            })
        }

        $scope.pickPhoto = function($event, slide) {

            $event.preventDefault();
            dialogService.mediaPicker({ onlyImages : true, callback : function(media) {

                $scope.current.backgroundUrl = media.image
            }})
        } 

        $scope.pickLink = function($event, slide) {

            $event.preventDefault();
            dialogService.linkPicker({ onlyImages : true, callback : function(item) {

                debugger
                $scope.current.link = item.url
            }})
        }         
    }]);