/**
 * Module dependencies.
 */
// load APM newRelic agent
var newrelic = require('./newrelic');

var assert = require("assert");

var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoskin = require('mongoskin');
var mongo = require("mongodb");



// load mongodb url
var mongodbUrl = process.env.MONGOHQ_URL;

var db = mongoskin.db(mongodbUrl, {
	native_parser : true
});

var app = express();

// all environments

app.use(logger('dev'));
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({
	limit : '5mb'
}));
app.use(bodyParser.urlencoded({
	extended : true,
	limit : '5mb'
}));
app.use(multer({
	dest : './tmp',
	inMemory : true
}));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
	// only use in development
	var errorhandler = require('errorhandler')
	app.use(errorhandler())
}

var dataServiceRouter = require("./data/service.js");
var materialRouter = require('./routes/material.js');
app.use('/data', dataServiceRouter);
app.use('/gallery/material', materialRouter);



http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
