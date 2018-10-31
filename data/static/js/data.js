$('#btn_delete').click(function() {
  $.ajax({
    url: 'deletedata',
    type: 'GET',   
    success:function(arg){
      location.reload();
    }
  })
})