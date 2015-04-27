var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');  ;

/**
 *   * @module  User
 *     * @description contain the details of Attribute  
 *     */

var UserSchema = new Schema({

    /** 
     *     User ID. It can only contain string, is required and unique field which is indexed.
     *       */
    //userId : { type: String, unique: true, required: true },

    /** 
     *     User Name. It can only contain string, is required field.

     *       */
    // saves user email, validation of email address is done in paylod
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
      type: String,
      unique: true,
      required: true

    },
        // hashed password is saved
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }

});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email', hashField: 'password', usernameLowerCase: true });  

var user = mongoose.model('user', UserSchema);

/** export schema */
module.exports = {
    User : user
};
