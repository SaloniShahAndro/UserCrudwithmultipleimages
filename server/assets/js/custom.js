/* on window ready */
$(document).ready(function () {
	$('input[type="radio"]').parent().addClass('radio-style');
	$('input[type="checkbox"]').parent().addClass('check-style');
	$('input[type="radio"]').parent().append('<em class="checkmark"></em>');
	$('input[type="checkbox"]').parent().append('<em class="checkmark"></em>');
	$('#m-trigger').click(function () {
		//$('#main-menu').slideToggle('fast');
		$('body').toggleClass('openflipmenu');
	});

	$(".tree-menu li").children('ul').parent().addClass("child-menu").prepend(
        "<span class='arrow-down fa fa-caret-right'><i></i></span>");
    $('.arrow-down').each(function () {
        $(this).on('click', function (event) {
            if (!$(this).parent().hasClass('open-menu')) {
                $(this).parent().next().prev().removeClass('open-menu');
                $(this).parent().prev().removeClass('open-menu');
            }
            $(this).parent().toggleClass('open-menu');
            $(this).parent().next().removeClass('open-menu');
            $(this).parent().prev().removeClass('open-menu');
        })
    })

	// $('.tab-handler').on('click', function()
	// {
	// 	if($(".tab-row").hasClass("active"))
	// 	{
	// 		if($(this).parents(".tab-row").hasClass("active"))
	// 		{
	// 			$(this).parents(".tab-row").removeClass('active');
	// 		}
	// 		else
	// 		{
	// 			$('.tab-row').removeClass('active');
	// 			$(this).parents(".tab-row").addClass('active');
	// 		}
	// 	}
	// 	  else
	// 	{
	// 		$(this).parents(".tab-row").toggleClass('active');
	// 		removeClass = true;
	// 	}

	// 	if($(".tab-row").hasClass("active"))
	// 	{
	// 		$(".tab-row .tab-slide").slideUp("fast");
	// 		$(".tab-row.active .tab-slide").slideDown("fast");
	// 	}
	// 	else
	// 	{
	// 		$(".tab-row .tab-slide").slideUp("fast");
	// 	}


	// });
	$(".leftpanel li .fa-angle-down").click(function () {
		$(this).parent("li").toggleClass("active").siblings().removeClass("active")
		$(".leftpanel > ul > li > ul").slideUp();
		if ($(".leftpanel li").hasClass("active")) {
			$(this).next().slideDown();
		}
		else {
			$(".leftpanel li > ul").next().slideUp();
		}

	})

	$(".menucollapse").on('click', function () {
		$("body").toggleClass("left-collapse")
		$(".leftpanel ul ul").hide()
	})

	// $.ajax({
    //     type: 'GET',
    //     url: '/api/user/ischecker',
    //     success: function(res) {
    //         if(res.status == 'success'){
    //             if(res.data.committeeChecker)
    //                 $(".checker-block").show().find("li:eq(1)").show();

    //             if(res.data.meetingChecker)
    //                 $(".checker-block").show().find("li:eq(2)").show();
    //         }
    //     }
	// }); 
	
	$(document).on("click", "#clear_data", function () {
		$.ajax({
			url: '/add-clearlogs',
			type: 'GET',
			data: "cleardata=true",
			success: function (response) {
				$(".committee_body").text(response.message);
				$(".clear_footer_yes").hide();
				$(".clear_footer_no").text('Close');
				//$('#clearLogModal').modal('hide');
			}
		});
	});
	
	$(document).on("click",".clear_footer_no" , function () {
		$("#clearLogModal").html("");
	});

});


function openClearData(){
	$('#clearLogModal').modal();        
}

/* on window load */
$(window).load(function () {
	
	 // $("#embed-view").mCustomScrollbar({

	 // });

});

/* on window resize */
$(window).resize(function () {

});