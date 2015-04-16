var Hapi = require('hapi');
var db = require('./database');
var config = require('./config');
var server = new Hapi.Server();
server.connection({ port: (process.env.PORT || 5000) });

server.views(config.options.views);

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});


server.start(function () {
    console.log('Server running at:', server.info.uri);
});

