/**
 * New node file
 */

/**
 * data service restful api
 */

// load required modules
var express = require("express");
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoskin = require('mongoskin');
var mongo = require("mongodb");

var assert = require("assert");

var scs = require('scs-sdk');

/*
 * Load the S3 information from the environment variables.
 */
var SCS_ACCESS_KEY = process.env.SCS_ACCESS_KEY;
var SCS_SECRET_KEY = process.env.SCS_SECRET_KEY;
var SCS_BUCKET = process.env.SCS_BUCKET

var scsConfig = new scs.Config({
	accessKeyId : SCS_ACCESS_KEY,
	secretAccessKey : SCS_SECRET_KEY,
	sslEnabled : false
});

// 全局生效:
scs.config = scsConfig;

module.exports = (function() {
	'use strict';
	var router = express.Router();

	// load mongodb url
	var mongodbUrl = process.env.MONGOHQ_URL;

	var db = mongoskin.db(mongodbUrl, {
		native_parser : true
	});

	router.use(bodyParser.json({
		limit : '5mb'
	}));
	router.use(bodyParser.urlencoded({
		extended : true,
		limit : '5mb'
	}));
	router.use(cookieParser());

	// set db for each request
	router.use(function(req, res, next) {
		req.db = db;
		next();
	});

	router.post('/sync-from-cloud', function(req, res) {
		var db = req.db;
		var marker = req.body.marker || '';
		var maxKey = req.body.max || 100;
		var prefix = req.body.prefix || '';
		// list all files
		var scsClient = new scs.S3();
		var params = {
			Bucket : SCS_BUCKET, // required
			Delimiter : '/', // 用'/'折叠
			Marker : marker, // 分页标签
			MaxKeys : maxKey, // 最大成员数
			Prefix: prefix
		};

		scsClient.listObjects(params, function(err, data) {

			if (err) {
				console.log(err, err.stack);
				res.status(500);
				res.send(err.message);
			}else {
				var images = data.Contents;
				console.log(images.length); // successful response
				images.forEach(function(image){
					//console.log(image.Key);
					// check if existed on db
					var criteria ={};
					db.collection('material').find(criteria).toArray(function(err, items) {
						  assert.ok(err == null);
						  if(items.length == 0){
							  var newItem = {
									  bucket:SCS_BUCKET,
									  key:image.Key,
									  lastModifiedTime:new Date()
							  };

							  db.collection('material').insert(newItem, function(err, result){
							    	if(err){
							    		console.error('Inserted image with key: '+image.Key+" failed.");
							    	}else{
							    		console.info('Inserted image with key: '+image.Key);
							    	}
							    });
						  }else{
							  console.info('Key: '+image.Key+" is existed.");
						  }
					});
				});
				
				res.send('success');
			}
		});
	});
	// get model

	router.post("/addTag", function(req, res) {
		
		var db = req.db;
		var materialId = req.body.id;
		var tagsStr = req.body.tags;
		var tagsTmp = tagsStr.split(" ");
		var tags =[];
		tagsTmp.forEach(function(e){
			var tmp = e.trim();
			if(tmp != ""){
				tags.push(tmp);
			}
		})

		// load material
		db.collection('material').findById(
				materialId,
				function(err, model) {
					if (err) {
						res.status(500);
						res.send(err.message);
					} else {
						if (model.tags === undefined) {
							model.tags = [];
						}

						tags.forEach(function(tag) {
							if(model.tags.indexOf(tag) == -1){
								model.tags.push(tag);
							}
						});

						db.collection('material').updateById(materialId, model,
								function(err, result) {
									if (err) {
										res.status(500);
										res.send(err.message);
									} else {
										res.send("success");
									}
								});
					}
				});
	});

	return router;
})();