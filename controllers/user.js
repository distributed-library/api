var Joi = require('joi'),
    Boom = require('boom'),
    User = require('../models/user').User,
    mongoose = require('mongoose');
    Utils = require('../lib/utils')
var privateKey = process.env.PRIVATE_PASSPHARSE;

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
                userName: user.userName;
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
  if (request.payload.password === Common.decrypt(user.password)) {
    if(!user.isVerified) return reply("Your email address is not verified. please verify your email address to proceed");
    var tokenData = {
      username: user.userName,
      scope: [user.scope],
      id: user._id
    };
    var res = {
      username: user.userName,
      scope: user.scope,
      token: Jwt.sign(tokenData, privateKey)
    };
    reply(res);
  }  
  else{
   reply(Boom.forbidden("invalid username or password"));
  }


}

exports.login = {
  validate: {
    payload: {
      userName: Joi.string().email().required(),
      password: Joi.string().required()
    }

  },
  handler: function(request, reply){
    User.findUser(request.payload.userName, function(err, user) {
      if(!err){
        if (user === null) return reply(Boom.forbidden("invalid username or password"));    
        login(user, request, reply);        
      } else {
        handle_login_error(err, reply)
      }
      
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
