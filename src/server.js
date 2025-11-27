const express = require('express');
const bodyParser = require('body-parser');

const apiRoutes = require('./routes'); 
const logger = require('./utils/logger');
const { PORT } = require('./config/server-config');

const app = express();

// 1. Middleware Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Route Registration
app.use('/api', apiRoutes);

// 3. Server Start
app.listen(PORT, async () => {
      logger.info(
    `Auth Server running on port ${PORT}`
  );

});