var Joi = require('joi'),
    Boom = require('boom'),
    User = require('../models/user').User,
    mongoose = require('mongoose');
    Utils = require('../lib/utils')
var privateKey = process.env.PRIVATE_PASSPHARSE;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
    validate: {
        payload: {
            username: Joi.string().required(),
            password: Joi.string().required()
        }
    },
    handler: function(request, reply){
        request.payload.password = Utils.encrypt(request.payload.password)
        var user = new User(request.payload);
        user.save(function(err, user){
          if(!err){
              var tokenData = {
                userName: user.userName,
                id: user._id
              };
              Utils.sentMailVerificationLink(user,Jwt.sign(tokenData, privateKey)); 
              return reply({message: 'Confirmation mail is being send to your mail'}).created('/user/');
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
    User.authenticate()(request.payload.email, request.payload.password, function (err, user, message) {
      // There has been an error, do something with it. I just print it to console for demo purposes.
      message = {};
      if (err) {
          console.error(err);
          message = {error: 'Failed to login'}
          return reply(message);
      }

      // If the authentication failed user will be false. If it's not false, we store the user
      // in our session and redirect the user to the hideout
      if (user) {
          request.auth.session.set(user);
          return reply({success: true});
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
