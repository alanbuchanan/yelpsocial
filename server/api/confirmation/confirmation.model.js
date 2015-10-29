'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConfirmationSchema = new Schema({
  venue: String,
  attendees: Array
}, { versionKey: false });

module.exports = mongoose.model('Confirmation', ConfirmationSchema);
