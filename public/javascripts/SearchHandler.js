$(function()
{
    //TODO allow search by contract address

    $("#searchButton").click(() =>
    {
        let searchTerm = $("#searchBox").val();
        window.location.replace("/search/" + searchTerm);
    })

});
