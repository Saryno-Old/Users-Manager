import * as benchrest from 'bench-rest';

var flow = 'http://localhost:3000/users';

module.exports = flow;

var runOptions = {
  limit: 1000, // concurrent connections
  iterations: 100_000, // number of iterations to perform
};
benchrest(flow, runOptions)
  .on('error', function(err, ctxName) {
    console.error('Failed in %s with err: ', ctxName, err);
  })
  .on('end', function(stats, errorCount) {
    console.log('error count: ', errorCount);
    console.log('stats', stats);
  });
