/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


 // var result = rooms.map(a => a.properties); rooms es un arreglo de objetos, retorna un array de la propiedad properties de rooms.

module.exports = {
	play: function(req, res){
		return res.view('game/index',{title:"Play"});
	},

	
	chat: function(req, res){
		if(req.isSocket){
			var socketId = sails.sockets.getId(req);
			var tempPlayer = HashMap.userMap.get(socketId); // Player
			var roomIn = tempPlayer.roomIn;
			sails.sockets.broadcast(roomIn, 'chat', {id: tempPlayer.nickName, message: req.param('message')});
		}
	}
}

