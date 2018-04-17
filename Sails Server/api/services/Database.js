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
    User.findOne({id: id}).exec(function(err, user) {
      if (err) return next(err);
      if (!user) return res.serverError('User doesn\'t exist.');

      let userObj = { tokens: (user.tokens + money)};

      User.update({id: id}, userObj).exec(function afterwards(err, updated){
        if (err) {
          console.log(err);
          return false;
        }
        console.log(updated);
        return true;
      });  
    });
  },

  substractMoney: function(id, money){
    User.findOne({id: id}).exec(function(err, user) {
      if (err) return next(err);
      if (!user) return res.serverError('User doesn\'t exist.');

      let userObj = { tokens: (user.tokens - money)};

      User.update({id: id}, userObj).exec(function afterwards(err, updated){
        if (err) {
          console.log(err);
          return false;
        }
        console.log(updated);
        return true;
      });  
    });
  },
}