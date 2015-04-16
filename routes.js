
var User = require('./controllers/user');

exports.endpoints = [

    { method: 'POST', path: '/user', config: User.create},
    { method: 'GET', path: '/users', config: User.getAll},
    { method: 'GET', path: '/user/{username}', config: User.getOne},
    { method: 'PUT', path: '/user/{username}', config: User.update},
    { method: 'DELETE', path: '/user/{username}', config: User.remove},
];
