var Hapi = require('hapi');

var server = new Hapi.Server();
var mongodburi = process.env.MONGOLAB_URI;

var dbOpts = {
    "url": mongodburi,
    "settings": {
        "db": {
            "native_parser": false
        }
    }
};

server.connection({ port: (process.env.PORT || 5000) });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.register({
  register: require('hapi-mongodb'),
  options: dbOpts
  },function(err){
    if(err){
      console.log(err);  
    }  
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

