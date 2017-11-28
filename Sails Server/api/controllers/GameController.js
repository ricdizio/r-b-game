/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var gameServer = require('../services/gameServer');

module.exports = {

	play: function(req, res, next) {
		
		  // falta implementar mas seguirdad seguiridad
		  
		  if(!req.session.authenticated){
		   var loginRequiredError = [{
			name: 'loginRequired',
			message: 'You must be loged to play.'
		   }];
		
		   // Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
		   // the key of loginRequiredError
		   req.session.flash = {
			err: loginRequiredError
		   };
		   return res.redirect('/login');
		  }
		  
		
		  // Verificar si tiene credito en la base de datos para jugar
		  var element = req.session.User.nickName;
		
		  User.findOne({nickName: element}).exec(function(err, user) {
		   if(user.tokens < 500){
			console.log("mandar error no posee credito");
		   }
		   console.log(user.nickName);
		   gameServer.chupalo({nickName : user.nickName});
		   console.log(user.nickName);
		  });
		  return res.view('game/index',{title:"R&B - Play"});
		 },
};

