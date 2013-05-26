#!/usr/bin/env node
var path = require('path');
var http = require('http');
var express = require('express');

if (!module.parent) {
    var serverConfig = require('./config').server;
    var routerConfig = require('./config').routers;
    var blogConfig = require('./config').blogConfig;

    var app = express();
    app.set('root', serverConfig.root);
    app.set('port', serverConfig.port);
    app.set('views', serverConfig.root + '/views');
    app.set('view engine', 'jade');

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());

    // now set logic beans
    var manager = require('./logic/manager')(blogConfig);
    app.use(function(req, res, next) {
        req.beans = {
            'manager': manager
        };
        next();
    });

    app.use(app.router);
    app.use(express.static(path.join(serverConfig.root, 'public')));


    // set router
    require('./router').route(app, routerConfig);

    // debug only
    if (serverConfig.debug) {
        app.use(express.errorHandler());
    }

    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
}
