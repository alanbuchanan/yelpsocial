'use strict';

var _ = require('lodash');
var Confirmation = require('./confirmation.model.js');

// Get a single confirmation
exports.show = function (req, res) {
      //console.log(req.params);
  Confirmation.find({
      // Query
      venue: req.params.barId
    },
    // Projection
    function (err, confirmation) {
      if (err) { return handleError(res, err); }
      if (!confirmation) { return res.status(404).send('Not Found'); }
      return res.json(confirmation);
    });
};

exports.create = function (req, res) {
  Confirmation.findOneAndUpdate({
    // Query
    venue: req.params.barId
  }, {
    // Doc
    $addToSet: {
      attendees: req.params.userId
    }
  }, {
    // Options
    upsert: true,
    new: true
    // Callback
  }, function (err, confirmation) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(confirmation);
  });
};

exports.remove = function (req, res) {
  Confirmation.findOneAndUpdate({
    // Query
    venue: req.params.barId
  }, {
    // Doc
    $pull: {
      attendees: req.params.userId
    }
  }, {
    // Options
    new: true
    // Callback
  }, function (err, confirmation) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(confirmation);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
