var Joi = require('joi'),
    Boom = require('boom'),
    User = require('../models/user').User,
    mongoose = require('mongoose'),
    Utils = require('../lib/utils'),
    Jwt = require('hapi-auth-jwt');
var privateKey = process.env.PRIVATE_PASSPHARSE;
var jwt = require('jwt-simple');
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
//passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());
//
exports.getAll = {
  handler:  function(request, reply){
    User.find({}, function(err, user){
      if(!err){
        return reply(user);
      }
      return reply(Boom.badImplementation(err)); // 500 error
    });
  }
};

exports.getOne = {
  handler: function(request, reply){
    User.findOne({'username': request.params.username}, function(err, user){
      if(!err){
        return reply(user);
      }
      return reply(Boom.badImplementation(err)); // 500 error
    });
  }
};

exports.create = {
  handler: function(request, reply){
    request.payload.password = Utils.encrypt(request.payload.password)
    var user = new User(request.payload);
    user.save(function(err, user){
      if(!err){
        var tokenData = {
          username: user.username,
      id: user._id
        };
        //Utils.sentMailVerificationLink(user,Jwt.sign(tokenData, privateKey)); 
        return reply({message: 'Confirmation mail is being send to your mail'});
      }
      return reply(Boom.forbidden(err)); // HTTP 403
    });
  }
};

function handle_login_error(err, reply){
  if (11000 === err.code || 11001 === err.code) {
    reply(Boom.forbidden("please provide another user email"));
  } else {
    console.error(err);
    return reply(Boom.badImplementation(err));
  } 

}

function login(user, request, reply){


}

exports.login = {
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  },

  handler: function(request, reply){
    user = User.findOne({"email" : request.payload.email, "password" : Utils.encrypt(request.payload.password)}, function(err, user){
      var  message = {};
      if (err) {
        console.error(err);
        message = {error: 'Failed to login'}
        return reply(message);
      }

      if (user) {
        var payload = { user: user.username };
        var token = jwt.encode(payload, privateKey);
        return reply({login: 'success', token: token});
      }
      return reply(message);
    });     

  }
} 

exports.remove = {
  handler: function (request, reply) {
    User.findOne({ 'username': request.params.username }, function (err, user) {
      if (!err && user) {
        user.remove();
        return reply({ message: "User deleted successfully"});
      }
      if (!err) {
        return reply(Boom.notFound());
      }
      return reply(Boom.badRequest("Could not delete user"));
    });
  }
};

exports.update = {
  validate: {
    payload: {
      username: Joi.string().required()
    }
  },
  handler: function (request, reply) {
    User.findOne({ 'username': request.params.username }, function (err, user) {
      if (!err && user) {
        user.username = request.payload.username;
        user.save();
        return reply(user);
      }
      if (!err) {
        return reply(Boom.notFound());
      }
      return reply(Boom.badRequest("Could not delete user"));
    });
  }
};


exports.verify_email = {
  handler: function(request, reply){
    Jwt.verify(request.headers.authorization.split(" ")[1], privateKey, function(err, decoded) {
      if(decoded === undefined) return reply(Boom.forbidden("invalid verification link"));
      User.findUserByIdAndUserName(decoded.id, decoded.userName, function(err, user){
        if(err){
          return reply(Boom.badImplementation(err));
        }
        if (user === null) return reply(Boom.forbidden("invalid verification link"));
        if (user.isVerified === true) return reply(Boom.forbidden("account is already verified"));
        user.isVerified = true;
        User.updateUser(user, function(err, user){
          if (err) {
            console.error(err);
            return reply(Boom.badImplementation(err));
          }
          return reply("account sucessfully verified");
        })
      });
    });
  }    

}
