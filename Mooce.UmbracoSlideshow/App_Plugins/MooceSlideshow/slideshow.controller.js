angular.module("umbraco")
    .controller("Mooce.Slideshow",
    ['$scope', '$http', 'assetsService', 'dialogService', function ($scope, $http, assetsService, dialogService) {
        
        assetsService.loadCss("https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css");
        assetsService.loadCss("/App_Plugins/MooceSlideshow/styles.css");
        
        $scope.model.value = angular.extend({}, { 
            slides : [], slideDuration : 1000 
        }, $scope.model.value)
        
        $scope.toggledSlide = null;

        $scope.getAllSlides = function() {

            return $scope.model.value.slides
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

            var value = $scope.model.value;
            var index = value.slides.indexOf(slide);

            if(index !== -1) {
                value.slides.splice(index, 1)
            }

            if($scope.toggledSlide === slide) {
                $scope.toggledSlide = null
            }
        }

        $scope.addSlide = function($event) {
            $event.preventDefault();

            var index = $scope.model.value.slides.length

            $scope.model.value.slides.push({
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