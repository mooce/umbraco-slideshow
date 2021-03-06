angular.module("umbraco")
    .controller("Mooce.Slideshow",
    ['$scope', '$http', '$q', 'assetsService', 'dialogService', function ($scope, $http, $q, assetsService, dialogService) {
        
        assetsService.loadCss("https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css");
        assetsService.loadCss("/App_Plugins/MooceSlideshow/slideshow.styles.css");
        
        function sanitize(slides) {
            
            if(!Array.isArray(slides)) {
                slides = []
            }

            slides = slides.filter(function(slide) {
                if(!Number.isInteger(slide.index)) {
                    return false;
                }
                if(!Number.isInteger(slide.duration)) {
                    return false;
                }

                return true;
            });

            slides = slides.map(function(slide) {
                return {
                    index : slide.index,
                    image : slide.image,
                    heading : slide.heading,
                    caption : slide.caption,
                    link : slide.link,
                    duration : slide.duration,
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

                $scope.slideDelete($event, slide);
            }

            $scope.selection = [];
        }

        $scope.slideDelete = function($event, slide) {
            
            $event.preventDefault();

            var index = $scope.slides.indexOf(slide);
            if(index === -1) return

            $scope.slides.splice(index, 1);

            // If slide being deleted currently toggled, untoggle it
            if(slide === $scope.slide) {
                $scope.slide = ''
            }
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
                link:'',
                duration:1
            };

            $scope.slides.unshift(slide);
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

            if(index === -1) return

            var slide = slides[index]
            
            if(direction > 0) {
                
                var next = slides[index + 1]
                if(next) {
                    slides[index + 1] = slide
                    slides[index] = next
                }
            }
            else if(direction < 0) {
                var prev = slides[index - 1]
                if(prev) {
                    slides[index - 1] = slide
                    slides[index] = prev
                }
            }

            $scope.slides = slides.map(function(slide, index) {
                slide.index = index
                return slide;
            });
        }
    }]);