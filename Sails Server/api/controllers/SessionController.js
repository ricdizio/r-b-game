/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt');

module.exports = {

	'new': function(req, res, next) {
		req.session.authenticated = true;
		console.log(req.session);
		res.view('session/new',{title:"R&B - Sign In"});
	},

	create: function(req, res){

	}
};

