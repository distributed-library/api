var Joi = require('joi'),
    Boom = require('boom'),
    User = require('../models/user').User,
    mongoose = require('mongoose');

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
            username: Joi.string().required()
        }
    },
    handler: function(request, reply){
        var user = new User(request.payload);
        user.save(function(err, user){
          if(!err){
              return reply(user).created('/user/');
          }
          return reply(Boom.forbidden(err)); // HTTP 403
        });
    }
};

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

