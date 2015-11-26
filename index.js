var config = require('./config.js');
var server = require('./server.js');
var postgres = require('pg');
// console.log("logger started. Connecting to MongoDB...");
// mongoose.connect(config.db.mongodb);
// console.log("Successfully connected to MongoDB. Starting web server...");
server.start();
console.log("Successfully started web server. Waiting for incoming connections...");