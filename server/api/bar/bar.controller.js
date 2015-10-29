'use strict';

var _ = require('lodash');
var index = require('../../config/environment/index');

exports.show = function (req, res) {
  var location = req.params.location;

  var yelp = require("yelp").createClient({
    consumer_key: index.yelp.consumer_key,
    consumer_secret: index.yelp.consumer_secret,
    token: index.yelp.token,
    token_secret: index.yelp.token_secret
  });

  yelp.search({term: "bars", location: location}, function (err, data) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(data);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
