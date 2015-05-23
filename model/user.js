var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    db = require('../config/db').db;

autoIncrement.initialize(db);

/**
 * @module  User
 * @description contain the details of Attribute
 */

var User = new Schema({

    /** 
      email. It can only contain valid email id, should be unique, is required and indexed.
    */
    email: {
        type: String,
        unique: true,
        required: true
    },

    /** 
      password. It can only contain string, is required field.
    */
    password: {
        type: String,
        required: true
    },

    /** 
    username. It can only contain string, is required field.
  */
    username: {
        type: String,
        required: true
    },

    /** 
      propertyId. It can only contain string.
    */
    isVerified: {
        type: Boolean,
        default: false
    }


});

User.plugin(autoIncrement.plugin, {
    model: 'user',
    field: '_id'
});

User.statics.saveUser = function(requestData, callback) {
    var user = new this(requestData);
    user.save(callback);
};

User.statics.updateUser = function(user, callback) {
    user.save(callback);
};

User.statics.findUser = function(email, callback) {
    this.findOne({
        email: email
    }, callback);
};

User.statics.findUserByIdAndEmail = function(id, email, callback) {
    this.findOne({
        email: email,
        _id: id
    }, callback);
};

var user = mongoose.model('user', User);

/** export schema */
module.exports = {
    User: user
};
