$(function()
{
    //TODO allow search by contract address

    $("#searchButton").click(() =>
    {
        clicked();
    });

    function clicked()
    {
        let searchTerm = $("#searchBox").val();
        window.location.replace("/search/" + searchTerm);
    }


    $("#searchBox").keyup(function(event){
        if(event.keyCode == 13){
           clicked();
        }
    });

});
