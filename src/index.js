'use strict';
const express = require('express');
// const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');
const PORT = process.env.PORT || 8080;
app.use(bodyParser.json());

app.use('/', routes);
app.use('/entrees', routes);
app.use('/entree', routes);

app.listen(PORT);
console.log(`Running on http://${PORT}`);


module.exports = {
  app
}