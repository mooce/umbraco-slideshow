angular.module("umbraco")
    .controller("Mooce.Slideshow",
    ['$scope', '$http', 'assetsService', 'dialogService', function ($scope, $http, assetsService, dialogService) {
        
        // assetsService.loadCss("/App_Plugins/styles.css");

        // debugger
        // $scope.model.value = '{ slides : [] }'

        $scope.model = {
            slideDuration : 1000,
            slides : []
        }

        $scope.toggledSlide = null;

        $scope.getAllSlides = function() {

            return $scope.model.slides
        }

        $scope.isToggled = function(slide) {
            return $scope.toggledSlide === slide
        }

        $scope.toggleSlide = function(slide) {

            if($scope.toggledSlide === slide) {
                $scope.toggledSlide = null
            }
            else {
                $scope.toggledSlide = slide
            }
        }

        $scope.deleteSlide = function($event, slide) {
            $event.preventDefault();

            var model = $scope.model;
            var index = model.slides.indexOf(slide);

            if(index !== -1) {
                model.slides.splice(index, 1)
            }

            if($scope.toggledSlide === slide) {
                $scope.toggledSlide = null
            }
        }

        $scope.addSlide = function($event) {
            $event.preventDefault();

            var index = $scope.model.slides.length

            $scope.model.slides.push({
                index : index,
                backgroundUrl:'',
                heading:'Slide ' + index,
                caption:'',
                link:''
            })
        }

        $scope.pickPhoto = function($event, slide) {

            $event.preventDefault();
            dialogService.mediaPicker({ onlyImages : true, callback : function(media) {

                $scope.toggledSlide.backgroundUrl = media.image
            }})
        } 

        $scope.pickLink = function($event, slide) {

            $event.preventDefault();
            dialogService.linkPicker({ onlyImages : true, callback : function(item) {

                $scope.toggledSlide.link = item.url
            }})
        }         
    }]);