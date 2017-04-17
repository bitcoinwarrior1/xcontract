module.exports = {

     extractAbiFunctions : (abi) =>
     {
        let arrayOfFunctionObjects = [];

        for(i=0; i < abi.length; i++)
        {
            console.log("here is each element: " + JSON.stringify(abi[i]));

            if(abi[i].type == "function")
            {
                arrayOfFunctionObjects.push(abi[i]);
            }
        }

        console.log(arrayOfFunctionObjects);

        return arrayOfFunctionObjects;
    }

};
