
var User = require('./controllers/user');

exports.endpoints = [

    { method: 'POST', path: '/users', config: User.create},
    { method: 'GET', path: '/users', config: User.getAll},
    { method: 'GET', path: '/user/{username}', config: User.getOne},
    { method: 'PUT', path: '/user/{username}', config: User.update},
    { method: 'DELETE', path: '/user/{username}', config: User.remove},
    { method: 'POST', path: '/users/sign_in', config: User.login},
    //{ method: 'GET', path: '/users/sign_out', config: User.logout},
    { method: 'POST', path: '/users/confirmation', config: User.verify_email}
    //{ method: 'POST', path: '/users/password', config: User.forgot_password}
];
