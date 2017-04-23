var http = require('http');
var path = require('path');
var async = require('async');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var axios = require('axios');
var index = require('./routes/index');
var users = require('./routes/users');

const SERVER_PORT = process.env.PORT || 2220;
const SERVER_IP = process.env.IP || "0.0.0.0";
const HTML_CLIENT = 'angular-client'

var router = express();
var server = http.createServer(router); 
var sdk = require('@mapquest/io') ;
var appContext = new sdk.ApplicationContext('hollys-app', 'f2b83527-0a78-4fc7-a553-ba77ae7e6303') ;

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname+'/views/front.html'));
})

router.get('/test', (req, res, next) => {
  console.log('test request', request.params);
  response.send('HACKCU');
});
router.get('/clients', (req, res, next) => {
  appContext.clients.list()
    .then(clientList => {
      var subClientList = clientList.clients.slice(0,4);
      console.log(subClientList);
      return subClientList;
    })
    .then(clients => response.send({clients}), next);

});
router.get('/searchahead', function (req, res) {
axios.get('https://www.mapquestapi.com/search/v3/prediction?&limit=5&collection=adminArea,poi,address,category,franchise,airport&q=den', {
    params: {
      key: '3PGmI1qMtvRxfCRA7FEpSxBKjFqVCX29'
    }
  }) 
  .then(function (response) {
   res.json(response.data);
   console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
});
router.get('/geofences', (req, res, next) => {
  appContext.geofences.list()
    .then(geofenceList => {
      console.log('geofence list', Object.keys(geofenceList), geofenceList.geofences.length);
      return geofenceList.geofences.slice(0, 5);
    })
    .then(geofences => response.send({ geofences }), next);
});
router.get('/speed-alerts', (req, res, next) => {
  appContext.speedAlerts.list()
    .then(speedAlertList => {
      console.log('speed alert list', Object.keys(speedAlertList), speedAlertList.speedAlerts.length);
      return speedAlertList.speedAlerts.slice(0, 5);
    })
    .then(speedAlerts => response.send({ speedAlerts }), next);
});
router.set('views', path.join(__dirname, 'views'));
router.set('view engine', 'ejs');
router.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
router.use(logger('dev'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(express.static('public'))
router.use(express.static(path.join(__dirname, 'public')));

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/views/front.html'));
})
router.use('/users', users);
router.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
router.use(function(error, req, res, next) {
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};
  res.status(error.status || 500);
  res.render('error');
});

router.listen(SERVER_PORT, SERVER_IP, function onServerListening() {
  console.log("Server listening at", SERVER_IP + ":" + SERVER_PORT);
});

module.exports = router;
