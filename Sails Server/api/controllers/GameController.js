/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

<<<<<<< HEAD
var gameServer = require('../services/gameServer');
=======
 var gameServer = require('../services/gameServer');
>>>>>>> 710a9124ea25974b4aa751f9bccc678eb69202dd

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
		   };
		   console.log('Se conecto: ' + user.nickName);
		   var nickName = user.nickName
		   gameServer.chupalo(nickName);
		  });
		  return res.view('game/index',{title:"R&B - Play"});
		 },
};

