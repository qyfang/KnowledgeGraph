$(".choose1").click(function() {
  $(".choose1").addClass("active");
  $(".choose2").removeClass("active");
  $(".choose3").removeClass("active");

  $("#line").addClass("one");
  $("#line").removeClass("two");
  $("#line").removeClass("three");

  $("#first").addClass("active");
  $("#second").removeClass("active");
  $("#third").removeClass("active");
})

$(".choose2").click(function() {
  $(".choose1").removeClass("active");
  $(".choose2").addClass("active");
  $(".choose3").removeClass("active");

  $("#line").removeClass("one");
  $("#line").addClass("two");
  $("#line").removeClass("three");

  $("#first").removeClass("active");
  $("#second").addClass("active");
  $("#third").removeClass("active");
})

$(".choose3").click(function() {
  $(".choose1").removeClass("active");
  $(".choose2").removeClass("active");
  $(".choose3").addClass("active");

  $("#line").removeClass("one");
  $("#line").removeClass("two");
  $("#line").addClass("three");

  $("#first").removeClass("active");
  $("#second").removeClass("active");
  $("#third").addClass("active");
})


