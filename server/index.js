// REQUIRES
var bodyParser = require('body-parser');
var cluster = require('cluster');
var compression = require('compression');
var ejs = require('ejs');
var express = require('express');
var favicon = require('serve-favicon');
var helmet = require('helmet');
var mongoose = require('mongoose');
var morgan = require('morgan');
var nodemailer = require('nodemailer');
var os = require('os');
var path = require('path');
var main = require('./schemas/mains');

// ENVIRONMENT PROPERTIES
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || 8080;


// PRIVATE PROPERTIES
var clientPath = path.join(__dirname, '../client');


// MAIN
cluster.isMaster && process.env.NODE_ENV !== 'development' ? fork() : run();



// PRIVATE METHODS
function fork() {
	for (var i = 0, j = os.cpus().length; i < j; i++)
		cluster.fork();
}

function run() {
	var app = express();

	//MONGOOSE
	mongoose.connect('mongodb://localhost/helloworld');
	mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

	app.engine('html', ejs.renderFile);
	app.set('views', path.join(clientPath, 'html'));

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(compression());
	app.use(favicon(path.join(clientPath, 'fav/favicon.ico')));
	app.use(helmet());
	app.use(morgan('dev'));

	app.use('/css', express.static(path.join(clientPath, 'css')));
	app.use('/fav', express.static(path.join(clientPath, 'fav')));
	app.use('/img', express.static(path.join(clientPath, 'img')));
	app.use('/js', express.static(path.join(clientPath, 'js')));
	app.use('/lib', express.static(path.join(clientPath, 'lib')));

	app.get('/', function(req, res) { res.render('index.html'); });
	app.get('/api', function (req, res) {
		main.findOne({}, function (err, docs) {
			if (err) console.log(err);
			res.json(docs);
		});
	});
	app.all('/*', function(req, res) { res.render('404.html'); });

	app.listen(process.env.PORT, function() {
		console.log('AngularCourse Server is running in ' + process.env.NODE_ENV + '.');
		console.log('Listening on port ' + process.env.PORT + '.');
		console.log('Ctrl+C to shut down.');
	});
}

