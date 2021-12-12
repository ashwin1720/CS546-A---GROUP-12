$(function(){


  $('#searchForm').submit((event) =>{
  
  event.preventDefault();
  $('#forimg').empty()
  $('#error1').hide();
  $('#myErrors').empty()
  
  let searchedTerm = $("#search_term").val().trim();
  if(!searchedTerm){
      var $a = $("<p/>").addClass('myErrors').text('Please provide search term')
      $("<p/>").append($a).appendTo('#myErrors')
      return
  }
  if(searchedTerm.trim() == ""){
      var $a = $("<p/>").addClass('myErrors').text('Cannot be spaces')
      $("<p/>").append($a).appendTo('#myErrors')
      return
  }

  $.ajax({
      method:'GET',
      url:'/customer_index/customer_search/'+searchedTerm,
      success:function(res){
          if(res[0].filename === undefined){
              $('#errors').append(`<p class="new-error"> ${(`No books with that name,Search again`)} </p>`); 
              return 
          }else{
              $('#bookList').empty();
              for(let i = 0;i<res.length;i++){
                  $("#bookList").append('<li><a href="/customer_index/individual_book_page/'+res[i].filename+' onclick="getById('
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
  
  
  