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
			message: 'You must be logged to play.'
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
		  var t;
		  User.findOne({nickName: element}).exec(function(err, user) {
			t = user.tokens;
			/*var roomName = 'room1'; // No se como obtener esto aun, a traves del request o algo.
			if(user.tokens >= 500){
				var object = gameServer.hashMap.get(roomName);
				if(object.players.length < object.capacity){
					var userTemp = {
						nickName: user.nickName
						//money: user.money,
						//session: 
					}
					object.players.push(userTemp);
					gameServer.hashMap.set(roomName, object);
				}
				else{
					// Rechazar jugador
				}
			}
			else{
				console.log("mandar error no posee credito");
				
				//gameServer.addNick({nickName : user.nickName});
			}*/

			gameServer.addNick(user.nickName);
			});
			return res.view('game/index',{title:"R&B - Play",tokens: t});
		 },
};

