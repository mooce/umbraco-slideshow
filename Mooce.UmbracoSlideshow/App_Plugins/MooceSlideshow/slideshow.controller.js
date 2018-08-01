angular.module("umbraco")
    .controller("Mooce.Slideshow",
    ['$scope', '$http', 'assetsService', 'dialogService', function ($scope, $http, assetsService, dialogService) {
        
        assetsService.loadCss("https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css");
        assetsService.loadCss("/App_Plugins/MooceSlideshow/styles.css");
        
        // $scope.model.value = "What is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the phat is Lorem Ipsum?Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Why do we use it?It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).Where does it come from?Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of e Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, orem ipsum dolor sit amet.., comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from  by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.Where can I get some?There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.'";
        return;

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