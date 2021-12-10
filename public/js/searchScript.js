
 
    $(function() {
        $('#show').hide();
        $('#errors').hide();
        $('#error1').hide();
        $('#homeLink').hide();
        
        $.ajax({
            method: "GET",
            url: "/customer_index/customer_search",
            success: function (res) {
            if(!res){
               

                    var $a = $("<p/>").addClass('myErrors').text('Some error occurred')
                    $("<p/>").append($a).appendTo('#myErrors')
            }
            else{
                for (var i = 0; i < res.length; i++) {
                    $("#showList").append(
                        '<li><a href="#" onclick="getById(' +
                        res[i].id +
                          ')">' +
                          res[i].name +
                          "</a></li>"
                      );
            

                }   
}
},
error:function(textStatus, errorThrown) { 
    $('#errors').append(`<p class="new-error"> ${(`Some error occurred ${textStatus} ${errorThrown}`)} </p>`);
}      
});
        


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
