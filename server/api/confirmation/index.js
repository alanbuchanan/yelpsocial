'use strict';

var express = require('express');
var controller = require('./confirmation.controller.js');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:barId', controller.show);
router.post('/:barId/:userId', auth.isAuthenticated(), controller.create);
router.put('/:barId/:userId', auth.isAuthenticated(), controller.remove);

module.exports = router;
