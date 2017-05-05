var express = require('express');
var app = express();
var planout = require('../dist/planout.js');
var extend = require('./polyfills/extend.js');

var DummyExperiment = planout.Experiment.extend({
  setup: function() {
    this.name = "SampleExperiment";
  },
  assign: function(params, args) {
    params.set('signupText', new planout.Ops.Random.UniformChoice({ 'choices': ['Signup', 'Join now'], 'unit': args.id }));
  },
  configureLogger: function() {
    return;
  },
  log: function(stuff) {
    return;
  },
  getParamNames: function() {
    return this.getDefaultParamNames();
  },
  previouslyLogged: function() {
    return this._exposureLogged;
  }
});


app.get('/', function (req, res) {
  var experiment = new DummyExperiment({'id': req.connection.remoteAddress});
  res.send('<html><body>' + experiment.get('signupText') + '</body></html>');
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);

});
