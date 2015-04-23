var Hapi = require('hapi');
var Good = require('good');
var db = require('./config/database');
var Routes = require('./routes');
var server = new Hapi.Server();
var privateKey = process.env.PRIVATE_PASSPHARSE;
console.log(privateKey);
server.connection({ port: (process.env.PORT || 5000) });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.route(Routes.endpoints);

// Validate function to be injected 
var validate = function(token, callback) {
    // Check token timestamp
    var diff = Moment().diff(Moment(token.iat * 1000));
    if (diff > ttl) {
        return callback(null, false);
    }
    callback(null, true, token);
};
// Plugins
server.register([{
    register: require('hapi-auth-jwt')
}], function(err) {
    server.auth.strategy('token', 'jwt', {
        validateFunc: validate,
        key: privateKey
    });

    server.route(Routes.endpoints);
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
    events: {
        response: '*',
    log: '*'
    }
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
