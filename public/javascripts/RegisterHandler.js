$(function()
{
    $("#register").click(() =>
    {
        let dappName = $("#dappName").val();
        let abi = $("#abi").val();
        let contractAddress = $("#contractAddress").val();

        //re-route to take in registration details to db
        window.location.replace("/register/" + dappName + "/" + abi + "/" + contractAddress);
    });
});