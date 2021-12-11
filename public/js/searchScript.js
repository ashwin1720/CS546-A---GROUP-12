$(function(){


$('#searchForm').submit((event) =>{

event.preventDefault();
$('#errors').hide();
$('#forimg').empty()
$('#error1').hide();
$('#myErrors').empty()

let searchedTerm = $("#search_term").val().trim();
if(!searchedTerm){
    var $a = $("<p/>").addClass('myErrors').text('Please provide search term')
    $("<p/>").append($a).appendTo('#myErrors')
}
if(searchedTerm == " "){
    var $a = $("<p/>").addClass('myErrors').text('Cannot be spaces')
    $("<p/>").append($a).appendTo('#myErrors')
}

$.ajax({
    method:'GET',
    url:'/customer_index/customer_search/'+searchedTerm,
    success:function(res){
        if(res.length ==0){
            $('#errors').append(`<p class="new-error"> ${(`No shows with that name,Search again`)} </p>`); 
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

function getById(id) {
$("#show").hide();
$('#myErrors').empty()
$('#forimg').empty()
$("#showList").empty();
$.ajax({
  method: "GET",
  url: "http://api.tvmaze.com/shows/"+id,
  success: function (res) {
    if (!res) {
        var $a = $("<p/>").addClass('myErrors').text('Some error occurred')
                $("<p/>").append($a).appendTo('#myErrors')
    }else{
     

      let name = $("<h1></h1>").text(res.name);
      
     
      let thumbnail = $('<img id="dynamic">');
      if(res.image) {
        thumbnail.attr("src", res.image.medium);
      }
      else{
        $('<img id="thumbnails">').attr("src","/public/no_image.jpeg")
      }
      $("#forimg").append(name,thumbnail);

      $("#showList").append("<dl id='dlList'></dl>");
      let dl = $('<dt>Language</dt><dd>'+res.language+'<dd>');
      $("#dlList").append(dl)
      $("#dlList").append('<dt id="genres">Genres</dt>');



       for(let i=0;i<res.genres.length;i++){
           let $dd =$('<dd>'+res.genres[i]+'<dd>')
       $('#genres').append('<dd>'+res.genres[i]+'<dd>')
       }


       if(res.rating.average !==null){
       $("#dlList").append('<dt>Average Rating</dt><dd>'+res.rating.average+'<dd>')
       }
       else{
          $("#dlList").append('<dt>Average Rating</dt><dd>N/A<dd>')
       }
       if(res.network !==null){
       $("#dlList").append('<dt>Network Name</dt><dd>'+res.network.name+'<dd>')
       }
       else{
          $("#dlList").append('<dt>Network Name</dt><dd>N/A<dd>')
       }
       if(res.summary){
       $("#dlList").append('<dt>Summary</dt><dd>'+res.summary+'<dd>')
       }
       else{
          $("#dlList").append('<dt>Summary</dt><dd>N/A<dd>')
       }
       


      $("#show").show();
      $("#homeLink").show();
    } 
  },
});
}


