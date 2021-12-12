$(function(){


  $('#searchForm').submit((event) =>{
  
  
  $('#errors').hide();
  $('#forimg').empty()
  $('#error1').hide();
  $('#myErrors').empty()
  
  let searchedTerm = $("#search_term").val().trim();
  if(!searchedTerm){
      var $a = $("<p/>").addClass('myErrors').text('Please provide search term')
      $("<p/>").append($a).appendTo('#myErrors')
      event.preventDefault();
  }
  if(searchedTerm.trim() == " "){
      var $a = $("<p/>").addClass('myErrors').text('Cannot be spaces')
      $("<p/>").append($a).appendTo('#myErrors')
      event.preventDefault();
  }
  
  $.ajax({
      method:'GET',
      url:'/customer_index/customer_search/'+searchedTerm,
      success:function(res){
          if(res.length ==0){
              $('#errors').append(`<p class="new-error"> ${(`No shows with that name,Search again`)} </p>`); 
              event.preventDefault();
          }else{
              $('#bookList').empty();
             
  
              for(let i = 0;i<res.length;i++){
                  $("#bookList").append('<li><a href="/customer_index/individual_book_page/'+res[i].filename+'" onclick="getById('
                   + res[i].filename+')">'
                   + res[i].bookname
                  +' </a></li>');
  
                       
              }
              $('#bookList').show();
              $("#show").show();
             
          }
      },
      error:function(textStatus, errorThrown) { 
          $('#errors').append(`<p class="new-error"> ${(`Some error occurred ${textStatus} ${errorThrown}`)} </p>`);
      }
     
  })
  $("#homeLink").show();
  })
  
  });
  
  // function getById(id) {
  // $("#show").hide();
  // $('#myErrors').empty()
  // $('#forimg').empty()
  // $("#showList").empty();
  // $.ajax({
  //   method: "GET",
  //   url: "",
  //   success: function (res) {
  //     if (!res) {
  //         var $a = $("<p/>").addClass('myErrors').text('Some error occurred')
  //                 $("<p/>").append($a).appendTo('#myErrors')
  //     }else{
  //     } 
  //   },
  // });
  // }
  
  
  