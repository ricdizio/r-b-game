/**
 * DashboardController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


 // var result = rooms.map(a => a.properties); rooms es un arreglo de objetos, retorna un array de la propiedad properties de rooms.

module.exports = {
	index: function(req, res){
		res.redirect('/dashboard');
		return;
	}

}

