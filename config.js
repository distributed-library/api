var options = {
  views: {
        engines: { jade: require('jade') },
        path: __dirname + '/templates',
        compileOptions: {
            pretty: true
        }
    }
}

exports.options = options;
