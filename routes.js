// Load modules

var User      = require('./controller/user')

// API Server Endpoints
exports.endpoints = [

    { method: 'POST', path: '/users', config: User.create},
    { method: 'GET', path: '/users', config: User.getAll},
    { method: 'POST', path: '/login', config: User.login},
    { method: 'POST', path: '/forgotPassword', config: User.forgotPassword},
    { method: 'POST', path: '/verifyEmail', config: User.verifyEmail},
    { method: 'POST', path: '/resendVerificationEmail', config: User.resendVerificationEmail}
  
];
