document.addEventListener("DOMContentLoaded", function() {
   
    $(".datepicker").datepicker({
        showOn: "button",
        buttonImage: "images/calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",        
        changeMonth: true,
        changeYear: true,
        position: {
            my: "right",
            at: "left"
          }        
    });

    $(".listGridbtn" ).on( "click", function() {
        var targetDiv = $(this).attr('data-target');        
        $('.listGridbtn').removeClass('active');
        $(this).addClass('active')
        $('.listGridbox > div').addClass('d-none');
        $(targetDiv).removeClass('d-none');
    });        

});