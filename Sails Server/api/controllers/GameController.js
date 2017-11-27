/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	play: function(req, res, next) {

		// falta implementar mas seguirdad seguiridad

		if(!req.session.authenticated){
			var loginRequiredError = [{
				name: 'loginRequired',
				message: 'You must be loged to play.'
			}]

			// Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
			// the key of loginRequiredError
			req.session.flash = {
				err: loginRequiredError
			}
			return res.redirect('/login');
		}
		
		return res.view('game/index',{title:"R&B - Play"});
	},
};

