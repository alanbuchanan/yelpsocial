'use strict';

var _ = require('lodash');
var Confirmation = require('./confirmation.model.js');

// Get a single confirmation
exports.show = function (req, res) {
  Confirmation.find({
      // Query
      venue: req.params.barId
    },
    // Projection
    function (err, rsvp) {
      if (err) { return handleError(res, err); }
      if (!rsvp) { return res.status(404).send('Not Found'); }
      return res.json(rsvp);
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
  }, function (err, rsvp) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(rsvp);
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
  }, function (err, rsvp) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(rsvp);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
