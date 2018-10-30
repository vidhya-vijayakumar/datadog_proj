$(document).ready(function(){
  x = document.getElementById('para').innerHTML="helloworld";
    $('.delete-user').on('click', function(e){
      $target = $(e.target);
      console.log($target);
      $.ajax({
        type:'DELETE',
        url: '/users/delete',
        success: function(response){
          alert('Deleting User');
          window.location.href='/';
        },
        error: function(err){
          console.log(err);
        }
      });
    });
  });