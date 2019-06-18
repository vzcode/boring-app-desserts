'use strict';
const express = require('express');
const cors = require('cors');
const AWSXray = require('aws-xray-sdk');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');
const PORT = process.env.PORT || 8081;


app.use(bodyParser.json());
app.use(cors({
  origin: 'http://bas-c.s3-website-us-west-1.amazonaws.com'
}));
app.use(AWSXray.express.openSegment('Dessert Service'));
app.use('/api', routes);
app.use(AWSXray.express.closeSegment());

app.listen(PORT);
console.log(`Running on http://${PORT}`);


module.exports = {
  app
}