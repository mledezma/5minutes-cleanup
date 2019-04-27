/* global DBG */
'use strict';

/*
 * Blobal
 */
window.DBG = (typeof DBG === 'undefined') ? true : DBG;

/*
 * Var
 */
var $ = require('jquery');
var UI = require('./ui');
var Bumeran = require('./Bumeran');
require('bootstrap/dist/js/bootstrap.js');

/*
 * Require
 */
require('console');4

/* Track GA */
UI.trackGA();

/*
 * Ready
 */
$(document).ready(function () {
  // Call ctrl
  Bumeran.init();
});
