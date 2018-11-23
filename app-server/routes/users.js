const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Home Route to show all users
router.get('/', function(req, res){
  User.find({}, function(err, users){
    if(err){
      console.log(err);
    } else {
      res.render('display', {
        title:'Users',
        users: users
      });
    }
  });
});

// Show user
router.get('/user/:username', function(req, res){
  User.findOne({username: req.params.username}, function(err, user){
    if(err){
      console.log(err);
    } else {
      if(user) {
        res.render('show', {
          title:"User: "+user.username,
          user: user
        });
      } else {
        res.render('show', {
          title: "No such user:" + req.params.username,
          user: user
        });
      }
    }
  });
});

// Register Form
router.get('/register', function(req, res){
  //res.redirect('/newuser.html');
  res.render('register');
});

// Register Proccess
router.post('/register', function(req, res){
  const id = req.body.id;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  // add location later
  //const location = req.body.location;
  const password2 = req.body.password2;

  req.checkBody('id', 'Id is required').notEmpty();
  req.checkBody('username', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  //req.checkBody('location', 'Location is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else {
    let newUser = new User({
      id:id,
      username:username,
      email:email,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success','You are now registered and can log in');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

// Login Form
router.get('/login', function(req, res){
  res.render('login');
});

// Login Process
router.post('/login', function(req, res, next){
  console.log(req.session);
  passport.authenticate('local', {
    successRedirect:'/main',
    failureRedirect:'/users/login',
    failureFlash: true
  } )(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

// Load Update Form
router.get('/update', ensureAuthenticated, function(req, res){
  res.render('update');
});

// Update Submit POST Route
router.put('/update', function(req, res){
  console.log(req.body);
  // authenticate before updating
  User.findOne({username:req.body.username}, function(err, myUser){
    if(err) {
      console.log('Error occured!');
      console.log(err);
    } 
    if (myUser) {
      // if the user exists
      let updatedUser = {};
      updatedUser.id = req.body.id;
      updatedUser.username = req.body.username;
      updatedUser.email = req.body.email;
      updatedUser.password = req.body.password;
    
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(updatedUser.password, salt, function(err, hash){
          if(err){
            console.log(err);
          }
          updatedUser.password = hash;
          let query = {username:req.body.username};

          User.update(query, updatedUser, function(err){
            if(err){
              console.log(err);
              return;
            } else {
              req.flash('success', 'User Updated');
              res.redirect('/users/logout');
            }
          });
        });
      });
    } else {
      // Do not update
      res.render('update');
    }
    // later add this logic to see if the person is 
    // updating his own record
    /*if(myUser.id != req.user._id) {
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }*/
  });
});

// Load Update Form
router.get('/delete', ensureAuthenticated, function(req, res){
  res.render('delete');
});

router.delete('/delete', function(req, res){
  const username = req.body.username;
  console.log("user is : "+ username);
  req.checkBody('username', 'Name is required').notEmpty();
  let errors = req.validationErrors();
  // Check if username exists
  if(errors){
    res.render('delete', {
      errors:errors
    });
  } 
  User.findOne({username:req.body.username}, function(err, myUser){
    if(err) {
      console.log('Error occured!');
      console.log(err);
    } 
    if (myUser) {
      console.log("my user is : "+myUser);
      // if the user exists
      let query = {username:req.body.username};
        User.remove(query, function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'User Deleted');
            res.redirect('/users/logout');
          }
        });
      } else {
        req.flash('danger', 'User Not Found');
        res.render('delete');
      } 
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;