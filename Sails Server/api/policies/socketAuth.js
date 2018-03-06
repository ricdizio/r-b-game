/**
 * Allow any authenticated user socket.
*/
module.exports = function(req, res, next) {

  // User is allowed, proceed to controller
  if (req.session.authenticated && req.isSocket) {
    return next();
  }

  // User is not allowed
  else {
    var requireLoginError = [{name: 'requireLogin', message: 'You must be signed in.'}]
    return res.json({err: requireLoginError});
  }
};

