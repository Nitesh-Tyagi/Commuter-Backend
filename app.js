const express = require('express');
const cors = require('cors');
const app = express();
const apiRouter = require('./routes/api');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// CSV Writer setup
const csvWriter = createCsvWriter({
  path: 'log.csv',
  header: [
    {id: 'ip', title: 'IP'},
    {id: 'api', title: 'API'},
    {id: 'timestamp', title: 'TIMESTAMP'}
  ],
  append: true // This ensures data is appended to the CSV rather than overwriting it
});

// Middleware for logging
// Middleware for logging
function logRequest(req, res, next) {
    let apiLog = req.originalUrl;
  
    // Check if the API is 'getAll' and if there's a body with 'table'
    if (req.originalUrl.includes('/getAll') && req.body && req.body.table) {
      apiLog += `(${req.body.table})`;
    }
  
    const logEntry = {
      ip: req.ip,
      api: apiLog,
      timestamp: new Date().toISOString()
    };
  
    csvWriter.writeRecords([logEntry])
      .then(() => {
      });
  
    next();
  }
  

app.use(cors());
app.use(express.json());
// app.use(logRequest); // Use the logging middleware
app.use('/api', apiRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
