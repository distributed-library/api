var Hapi = require('hapi');
var Good = require('good');
var db = require('./config/database');
var Routes = require('./routes');
var server = new Hapi.Server();
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
