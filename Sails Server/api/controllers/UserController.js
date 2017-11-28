/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


// This loads the sign-up page --> new.ejs

new: function(req, res) {

    //console.log(req.session);
    if(req.session.authenticated)
    {
      res.redirect("/");
    }

    res.view("user/new",{title:"R&B - Sign up"});
  },


// Function that recived all param from the user
// Metho POST
create: function(req, res, next) {

    var userObj = {
      name: req.param('name'),
      lastName: req.param('lastName'),
      nickName: req.param('nickName'),
      email: req.param('email'),
      password: req.param('password'),
      confirmation: req.param('confirmation'),
      checkAdmin: req.param('checkAdmin')
    }
    //console.log(userObj.checkAdmin)

    // Create a User with the params sent from 
    // the sign-up form --> new.ejs
    User.create(userObj, function userCreated(err, user) {
      if(userObj.checkAdmin == "on") {user.admin = true};
      // // If there's an error
     // console.log(err);
      if (err) 
      {
        // flash.js 
        console.log(err);
        req.addFlash('err', err);
        return res.redirect('/signup');
      }

       // Log user in
      req.session.authenticated = true;

      // control de cookie
      req.session.User = 
        { 
           name: user.name,
             lastName: user.lastName,
             nickName: user.nickName,
             admin: user.admin,
             validated: user.validated,
             createdAt: user.createdAt,
             updatedAt: user.updatedAt,
             id: user.id
        }

      
      // Change status to online
      user.online = true;
      var usertoSave = user;
      user.save(function(err, user) 
      {
        if (err) return next(err);
		    res.redirect('/profile/' + usertoSave.nickName);
      });
    });
  },

// Method Get User found a User a return it
  getUser: function (req, res) {
    var element = req.param('nickname');
    //Search in dataBase for (user v : Users){ if (v.nickName==element) return this.user}
    User.findOne({nickName: element}).exec(function(err, user) {
        if (err) return next(err);
        if (!user) return res.serverError('User doesn\'t exist.');
        //return res.json(user);
        //console.log("elemento encontrado: " + element);
        //console.log("elemento user: " + user.nickName);
        //console.log(req.session);
      
        //Send in object response obj user found
        var nameUser = user.nickName;
        return res.view('user/profile',{user: user, title:"profile " + nameUser});
    });
  },

  verificate: function (req,res,next){
    res.send("Se verifica si es admin y esta logueado y luego se muestra acceso al panel");
  },

    // render the edit view (e.g. /views/edit.ejs)
  edit: function(req, res, next) {
    var element = req.param('nickname');
    // Find the user from the id passed in via params
    User.findOne({nickName: element}).exec(function(err, user) {
      if (err) return next(err);
      if (!user) return res.serverError('User doesn\'t exist.');
      var nameUser = user.nickName;
      return res.view("user/edit", {user: user, title:nameUser +" edit"});
    });
  },


  // process the info from edit view
  update: function(req, res, next) {

    var validatedAdmin = false;
    console.log("Estado admin: " + req.param('checkAdmin'));
    if(req.param('checkAdmin') == "on"){
      validatedAdmin=true;
    }

    if (req.session.User.admin) {
      var userObj = {
        name: req.param('name'),
        lastName: req.param('lastName'),
        email: req.param('email'),
        tokens: req.param('tokens'),
        admin: validatedAdmin
      }
    } else {
      var userObj = {
        name: req.param('name'),
        title: req.param('lastName'),
        email: req.param('email')
      }
    }

    User.update({nickName: req.param('nickname')},userObj).exec(function afterwards(err, updated){
      if (err) {
        console.log(err);
        return res.redirect('/profile/'+ req.param('nickname') + '/edit');
      }
      console.log(updated);
      res.redirect('/profile/' + req.param('nickname'));
    });
  },

  //Delete the user by nickname

  destroy: function(req, res, next) {
    var element = req.param("nickname");
    User.findOne({nickName: element}).exec(function(err, user) {
      if (err) return next(err);

      if (!user) return res.serverError('User doesn\'t exist.');

      User.destroy(req.param('nickName')).exec(function(err) {
        if (err) return next(err);
        console.log(user.nickName+" se a eliminado");
      });        

      res.redirect('/user');
    });
  },

  //List of users
  index: function(req, res, next) {

    // Get an array of all users in the User collection(e.g. table)
    User.find(function foundUsers(err, users) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view("user/index",{users: users,title:"List Users"});
    });
  },


  //List of users
  home: function(req, res, next) {
    var element= req.session.User.nickName;
    // Get an array of all users in the User collection(e.g. table)
    UUser.findOne({nickName: element}).exec(function(err, user) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view("homepage",{user: user,title:"Home"});
    });
  },

  getdata: function(req, res) {
    
    //if (!req.isSocket) {
    //  return res.badRequest();
    //}

    //if(!req.session.authenticated){
    //  return res.badRequest();
    //}

    return res.json({
      nickName: req.session.User.nickName,
    });
  },
};

