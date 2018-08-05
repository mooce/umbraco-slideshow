angular.module("umbraco")
    .controller("Mooce.Slideshow",
    ['$scope', '$http', '$q', 'assetsService', 'dialogService', function ($scope, $http, $q, assetsService, dialogService) {
        
        assetsService.loadCss("https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css");
        assetsService.loadCss("/App_Plugins/MooceSlideshow/styles.css");
        
        function sanitize(slides) {
            
            if(!Array.isArray(slides)) {
                slides = []
            }

            slides = slides.filter(function(slide) {
                return Number.isInteger(slide.index)
            });

            slides = slides.map(function(slide) {
                return {
                    index : slide.index,
                    image : slide.image,
                    heading : slide.heading,
                    caption : slide.caption,
                    link : slide.link,
                }
            });

            slides.sort(function(a,b) {
                return (b.index - a.index)
            });

            return slides
        }

        try {
            var slides = sanitize($scope.model.value)
            $scope.slides = slides
            $scope.model.value = slides
        }
        catch(err) {
            $scope.slides = []
            $scope.model.value = []
        }

        var listener = $scope.$watch('slides', function() {

            // Sanitize the model.value
            $scope.model.value = angular.toJson($scope.slides)

        }, true);
        
        $scope.$on('$destroy', function() {
            console.log('cleaning up..')
            listener();
        });

        $scope.slide = ''
        
        $scope.toggledSlide = null; 

        $scope.selection = []

        $scope.selectAll = function($event) {
            $event.preventDefault();

            if($scope.selection.length > 0) {
                
                $scope.selection = [];
            }
            else {
                
                // Shallow copy of slide array
                $scope.selection = [];
                for(var i = 0; i < $scope.slides.length; i++) {
                    $scope.selection[i] = $scope.slides[i];
                }
            }
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
                var index = $scope.slides.indexOf(slide);

                $scope.slides.splice(index, 1);

                // If slide being deleted currently toggled, untoggle it
                if(slide === $scope.slide) {
                    $scope.slide = ''
                }
            }

            $scope.selection = [];
        }

        $scope.slideAdd = function($event) {
            $event.preventDefault();

            var index = $scope.slides.length ? $scope.slides[0].index : 0
            var heading = 'Slide ' + $scope.slides.length
            var slide = {
                index : index,
                image:'',
                heading: heading,
                caption:'',
                link:''
            };

            $scope.slides.unshift(slide);
            $scope.slide = slide;
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
            
        }

        $scope.pickPhoto = function($event, slide) {

            $event.preventDefault();
            dialogService.mediaPicker({ onlyImages : true, callback : function(media) {
                if(!media.isFolder) {
                    slide.image = {
                        id : media.id,
                        name : media.name,
                        url : media.image
                    }
                }
            }})
        } 

        $scope.clearPhoto = function($event, slide) {

            $event.preventDefault();
            slide.image = ''
        } 

        $scope.pickLink = function($event, slide) {

            $event.preventDefault();
            dialogService.linkPicker({ onlyImages : true, callback : function(item) {
                
                slide.link = item
            }})
        }   
        
        $scope.clearLink = function($event, slide) {

            $event.preventDefault();
            slide.link = ''
        }    

        $scope.sortEnabled = function(slide, direction) {
            
            var slides = $scope.slides
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
            $event.stopPropagation();
            
            var slides = $scope.slides
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