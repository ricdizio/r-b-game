/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt');

module.exports = {

	new: function(req, res, next) {
		console.log(req.session);
		if(req.session.authenticated)
	    {
	      return res.redirect("/");
	    }
		return res.view('session/new',{title:"R&B - Sign In"});
	},

	create: function(req, res){
		var userLog;
		if(req.session.authenticated)
	    {
	      return res.redirect("/");
	    }
		// Check for email and password in params sent via the form, if none
		// redirect the browser back to the sign-in form.
		if (!req.param('email') || !req.param('password')) {
			// return next({err: ["Password doesn't match password confirmation."]});

			var usernamePasswordRequiredError = [{
				name: 'usernamePasswordRequired',
				message: 'You must enter both a username and password.'
			}]

			// Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
			// the key of usernamePasswordRequiredError
			req.session.flash = {
				err: usernamePasswordRequiredError
			}
			
			//Return with flash error
			
			return res.redirect('/session/new');
		}

		// Try to find the user by there email address. 
		// findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
		// User.findOneByEmail(req.param('email')).done(function(err, user) {

		User.findOne({email: req.param('email')}).exec(function(err, user) {
			if (err) return next(err);

			// If no user is found...
			if (!user) {
				var noAccountError = [{
					name: 'noAccount',
					message: 'The email address ' + req.param('email') + ' not found.'
				}]

				//Flash Error
				req.session.flash = {
					err: noAccountError
				}
				//Return whith flash messege
				return res.redirect('/login');
			}

			// Compare password from the form params to the encrypted password of the user found.
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
				if (err) return next(err);

				// If the password from the form doesn't match the password from the database...
				if (!valid) {
					var usernamePasswordMismatchError = [{
						name: 'usernamePasswordMismatch',
						message: 'Invalid username and password combination.'
					}]

					//fLash Error
					req.session.flash = {
						err: usernamePasswordMismatchError
					}

					//Return with flash error
					return res.redirect('login');; 

				}

				// Log user in
				req.session.authenticated = true;
				req.session.User = user;

				// Change status to online
				user.online = true;

				console.log("Antes de la funcion save");
				console.log(user);
				if (req.session.User.admin) {
					res.redirect('/user');
					return;
				}
				console.log("Antes del redirect");
				console.log(user);
				//Redirect to their profile page (e.g. /views/user/show.ejs)
				res.redirect('/profile/' + user.nickName);

				/*
				user.save(function(err, user) {
					if (err) return next(err);

					// Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
					//User.publishUpdate(user.id, {
					//	loggedIn: true,
					//	id: user.id,
					//	name: user.name,
					//	action: ' has logged in.'
					//});

					// If the user is also an admin redirect to the user list (e.g. /views/user/index.ejs)
					// This is used in conjunction with config/policies.js file
					if (req.session.User.admin) {
						res.redirect('/user');
						return;
					}
					console.log("Antes del redirect");
					console.log(user);
					//Redirect to their profile page (e.g. /views/user/show.ejs)
					res.redirect('/profile/' + user.nickName);
				});
				*/
			});
		});
	},

	destroy: function(req, res, next) {

		User.findOne({nickName: req.session.User.nickName}).exec(function(err, user) {

			var usernickName = req.session.User.id;

			if (user) {
				// The user is "logging out" (e.g. destroying the session) so change the online attribute to false.
				User.update({nickName: usernickName},{online:false}).exec(function afterwards(err, updated){

					if (err) return next(err);
					console.log(updated);
					
					// Inform other sockets (e.g. connected sockets that are subscribed) that the session for this user has ended.
					//User.publishUpdate(userId, {
					//	loggedIn: false,
					//	id: userId,
					//	name: user.name,
					//	action: ' has logged out.'
					//});

					// Wipe out the session (log out)
					req.session.destroy();

					// Redirect the browser to the sign-in screen
					res.redirect('/login');
				});
			} 

			else {

				// Wipe out the session (log out)
				req.session.destroy();

				// Redirect the browser to the sign-in screen
				res.redirect('/login');
			}
		});
	}

};

