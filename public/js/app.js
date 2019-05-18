'use strict';

// $('.select-button').on('click', function() {
//   $(this).next().removeClass('hide-me');
// });

// $(".button-detail").click(function(){
//   $("#form-details").toggle();
// });

(document).ready(function() {
  $('.button-detail').on('click', function(slide){
    $(slide.target).next().toggle(this);
  });
});
