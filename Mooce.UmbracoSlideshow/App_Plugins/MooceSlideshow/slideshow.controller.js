angular.module("umbraco")
    .controller("Mooce.Slideshow",
    ['$scope', '$http', 'assetsService', 'dialogService', function ($scope, $http, assetsService, dialogService) {
        
        assetsService.loadCss("https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css");
        assetsService.loadCss("/App_Plugins/MooceSlideshow/styles.css");
        
       debugger

        if(!Array.isArray($scope.model.value)) {
            $scope.model.value = []
        }

        $scope.model.value = $scope.model.value.filter(function(slide) {

            if(!Number.isInteger(slide.index)) return false;
            
            return true;
        })

        $scope.slide = $scope.model.value[0] /*{ 
            index : 2,
            heading : 'b',
            image:'',//'http://localhost:7000/media/1003/18531852339_981b067419_h.jpg',
            link : ''
        }*/
        /*''*/
        
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
                for(var i = 0; i < $scope.model.value.length; i++) {
                    $scope.selection[i] = $scope.model.value[i];
                }
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
                var index = $scope.model.value.indexOf(slide);

                $scope.model.value.splice(index, 1);

                // If slide being deleted currently toggled, untoggle it
                if(slide === $scope.slide) {
                    $scope.slide = ''
                }
            }

            $scope.selection = [];
        }

        $scope.slideAdd = function($event) {
            $event.preventDefault();

            var index = $scope.model.value.length
            var slide = {
                index : index,
                image:'',
                heading:'Slide ' + index,
                caption:'',
                link:''
            };

            $scope.model.value.unshift(slide);
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

        $scope.getAllSlides = function() {

            var slides = $scope.model.value

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
            
            var slides = $scope.model.value
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
            
            var slides = $scope.model.value
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