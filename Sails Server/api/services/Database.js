module.exports = {
  updateMoney: function(uId, amount){
    let userObj = { tokens: amount };

    User.update({id: uId}, userObj).exec(function afterwards(err, updated){
      if (err) {
        console.log(err);
        return false;
      }
      console.log('updated');
      return true;
    });  
  },
  addMoney: function(id, money){

  },
  substractMoney: function(id, money){

  }
}