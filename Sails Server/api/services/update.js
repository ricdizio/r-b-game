

module.exports = {

    updateMoney: function(uId,amount){

        //Object to update
        let userObj = { tokens: amount };

        User.update({id: uId},userObj).exec(function afterwards(err, updated){
            if (err) {
              console.log(err);
              return false;
            }
            console.log("ok");
            return true;
        });  
        
    }
}