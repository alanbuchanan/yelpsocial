'use strict';

var _ = require('lodash');
var Confirmation = require('./confirmation.model.js');

// Get a single confirmation
exports.show = function (req, res) {
      //console.log(req.params);
  Confirmation.findOne({
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
      // This is like array.push()
      attendees: req.params.userId
    }
  }, {
    // Options
    new: true,
    upsert: true,
    sort: false,
    passRawResult: false
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
      // This is like deleting with array.splice()
      attendees: req.params.userId
    }
  }, {
    // Options
    new: true,
    upsert: false,
    sort: false,
    passRawResult: false
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
