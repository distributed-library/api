var mongoose = require('mongoose');

var mongodburi = process.env.MONGOLAB_URI || "mongodb://localhost:27017/mydb";
mongoose.connect(mongodburi);
var db = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error'));
db.once('open', function callback(){
  console.log("connection with database succeded");
});

exports.db = db;
exports.Mongoose = mongoose;
