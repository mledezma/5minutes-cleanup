'use strict';

var $ = require('jquery');
var Bumeran = {};
var routes = require('./routes/routes');

Bumeran.shoot = function (name) {
  if (routes.hasOwnProperty(name)) {
    routes[name]();
  }
};

// Init
Bumeran.init = function () {
  var callCtrl = $('#main').data('ctrl');

  Bumeran.shoot('default');

  if (callCtrl) {
    Bumeran.shoot(callCtrl);
  }
};

/**
 * Module export
 */
module.exports = Bumeran;
