angular.module("umbraco")
    .controller("Mooce.Slideshow",
    ['$scope', '$http', 'assetsService', 'dialogService', function ($scope, $http, assetsService, dialogService) {
        
        assetsService.loadCss("https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css");
        assetsService.loadCss("/App_Plugins/MooceSlideshow/styles.css");
        
        $scope.model.value = angular.extend({}, { 
            slides : [], slideDuration : 1
        }, $scope.model.value)

        $scope.model.value.slides = [{ 
            index : 1,
            heading : 'a',
            backgroundUrl:'http://localhost:7000/media/1005/18530280048_459b8b61b2_h.jpg',
            link : 'http://localhost:7000/media/1003/18531852339_981b067419_h.jpg'
        },{ 
            index : 2,
            heading : 'asb',
            backgroundUrl:'http://localhost:7000/media/1003/18531852339_981b067419_h.jpg',
            link : 'http://localhost:7000/media/1003/18531852339_981b067419_h.jpg'
        },{ 
            index : 3,
            heading : 'asb',
            backgroundUrl:'http://localhost:7000/media/1003/18531852339_981b067419_h.jpg',
            link : 'http://localhost:7000/media/1003/18531852339_981b067419_h.jpg'
        },{ 
            index : 4,
            heading : 'basd',
            backgroundUrl:'http://localhost:7000/media/1003/18531852339_981b067419_h.jpg',
            link : 'http://localhost:7000/media/1003/18531852339_981b067419_h.jpg'
        },{ 
            index : 5,
            heading : 'asd',
            backgroundUrl:'http://localhost:7000/media/1003/18531852339_981b067419_h.jpg',
            link : 'http://localhost:7000/media/1003/18531852339_981b067419_h.jpg'
        }]

        $scope.slide = '' /*{ 
            index : 2,
            heading : 'b',
            backgroundUrl:'http://localhost:7000/media/1003/18531852339_981b067419_h.jpg',
            link : 'http://localhost:7000/media/1003/18531852339_981b067419_h.jpg'
        }*/
        
        $scope.toggledSlide = null;
        $scope.slideDuration = $scope.model.value.slideDuration

        $scope.selection = []

        $scope.selectAll = function($event) {
            $event.preventDefault();

            // Shallow copy of slide array
            $scope.selection = [];
            for(var i = 0; i < $scope.model.value.slides.length; i++) {
                $scope.selection[i] = $scope.model.value.slides[i];
            }
        }

        $scope.selectClear = function($event) {
            $event.preventDefault();

            $scope.selection = [];
        }

        $scope.selectToggle = function($event, slide) {
            $event.preventDefault();
            $event.stopPropagation();

            if($scope.selectIsToggled(slide)) {

                $scope.selection.splice($scope.selection.indexOf(slide), 1)
            }
            else {
                $scope.selection.push( slide )
            }
        }

        $scope.selectIsToggled = function(slide) {

            return $scope.selection.indexOf(slide) != -1
        }

        $scope.deleteSelected = function($event) {
            
            $event.preventDefault();

            // Close all dialogs, incase some dialog is open for configuration of the slide being deleted
            dialogService.closeAll();
            
            for(var i = 0; i < $scope.selection.length; i++) {
                
                var slide = $scope.selection[i];
                var index = $scope.model.value.slides.indexOf(slide);

                $scope.model.value.slides.splice(index, 1);

                // If slide being deleted currently toggled, untoggle it
                if(slide === $scope.slide) {
                    $scope.slide = ''
                }
            }

            $scope.selection = [];
        }

        $scope.slideAdd = function($event) {
            $event.preventDefault();

            var index = $scope.model.value.slides.length

            $scope.model.value.slides.push({
                index : index,
                backgroundUrl:'',
                heading:'Slide ' + index,
                caption:'',
                link:''
            });
        }

        ////

        $scope.slideToggle = function($event, slide) {

            if($scope.slide === slide) {
                $scope.slide = ''
            }
            else {
                $scope.slide = slide
            }
        }

        $scope.slideIsToggled = function(slide) {

            return $scope.slide === slide
        }

        ////

        $scope.onChangeSlideDuration = function() {
            $scope.model.value.slideDuration = $scope.slideDuration
        }

        $scope.getAllSlides = function() {

            var slides = $scope.model.value.slides

            return slides
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

        $scope.pickPhoto = function($event, slide) {

            $event.preventDefault();
            dialogService.mediaPicker({ onlyImages : true, callback : function(media) {

                slide.backgroundUrl = media.image
            }})
        } 

        $scope.clearPhoto = function($event, slide) {

            $event.preventDefault();
            slide.backgroundUrl = ''
        } 

        $scope.pickLink = function($event, slide) {

            $event.preventDefault();
            dialogService.linkPicker({ onlyImages : true, callback : function(item) {

                slide.link = item.url
            }})
        }   
        
        $scope.clearLink = function($event, slide) {

            $event.preventDefault();
            slide.link = ''
        }    

        $scope.sortEnabled = function(slide, direction) {
            
            var slides = $scope.model.value.slides
            var index = slides.indexOf(slide)
            if(direction < 0) {
                return index > 0
            }
            else {
                return index < slides.length - 1
            }
        }
        
        $scope.sortSlide = function($event, slide, direction) {

            $event.preventDefault();
            
            var slides = $scope.model.value.slides
            var index = slides.indexOf(slide)

            if(direction < 0) {

                if(index > 0) {

                    slides[ index - 1 ].index = index
                    slides[ index ].index = index - 1
                }
            }
            else {

                if(index < slides.length - 1) {
                    
                    slides[ index + 1 ].index = index
                    slides[ index ].index = index + 1
                }
            }

            slides.sort(function(a, b) { return  a.index - b.index })
        }
    }]);