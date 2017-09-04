var config  = require('config');
var restify = require('restify');
var promise = require('bluebird');
var pgp     = require('pg-promise')({promiseLib: promise});

const server = restify.createServer(config.get('General.server'));
const db = pgp(config.get('Database.postgres'));

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/echo/:name', function (req, res, next) {
  res.send(200, req.params);
  return next();
});

/* Get client IP v4 address */
server.get('/ip', function (req, res, next) {
  var ip = req.connection.remoteAddress;
  var ipv4 = ip.replace(/f/gi, '');
  ipv4 = ipv4.replace(/:/gi, '');
  res.send("You call: " + ipv4);
  // res.send("You're calling from: " + req.connection.remoteAddress);
  return next();
});

server.get('/dist/:uuid', function (req, res, next) {

  // Notify console/log about the retrieved request
  console.log('Retrieved a request to retrieve a case distribution');

  // Verify input parameters
  if (!req.params.uuid) {
    console.log(400, '- Parameter "uuid" missing.');
    res.send(400, 'Parameter "uuid" missing.');
    return next();
  }

  // Notify console/log about the uuid
  console.log("- uuid:", req.params.uuid);

  // Perform request
  db.query('SELECT case_name FROM vm_case WHERE vm_id = (SELECT id FROM vm WHERE uuid = $1)', req.params.uuid)
    .then(data => {
      if (data.length == 0) {
        console.log('- Distribution not found');
        res.send(404, 'Distribution not found');
        return next();
      }
      console.log('- Success');
      res.send(200, 'Success');
    })
    .catch(error => {
      console.log('- Unexpected error occurred', error);
      res.send(500, error);
      return next();
    });

  return next();
});

server.post('/dist/:uuid', function (req, res, next) {

  // Notify console/log about the retrieved request
  console.log('Retrieved a request to add a case distribution');

  // Verify input parameters
  if (!req.params.uuid) {
    console.log(400, '- Parameter "uuid" missing.');
    res.send(400, 'Parameter "uuid" missing.');
    return next();
  }
  if (!req.body) {
    console.log(400, '- Request body missing.');
    res.send(400, 'Request body missing.');
    return next();
  }
  if (!Array.isArray(req.body)) {
    console.log(400, '- Request body is not an array.');
    res.send(400, 'Request body is not an array.');
    return next();
  }
  if (req.body.length == 0) {
    console.log(400, '- Request body array empty (length zero).');
    res.send(400, 'Request body array empty (length zero).');
    return next();
  }
  if (req.body.length != 0) {
    for(var i = 0; i < req.body.length; i++) {
      var row = req.body[i];
      if (!row.case_name) {
        console.log('- Request body array item missing property "case_name"');
        res.send(400, '- Request body array item missing property "case_name"');
        return next();
      }
      if (typeof row.case_name != 'string') {
        console.log('- Request body array item property "case_name" is not a "string".');
        res.send(400, '- Request body array item property "case_name" is not a "string".');
        return next();
      }
      if (row.case_name.length == 0) {
        console.log('- Request body array item property "case_name" is empty.');
        res.send(400, '- Request body array item property "case_name" is empty.');
        return next();
      }
    }
  }

  // Notify console/log about the uuid
  console.log("- uuid:", req.params.uuid);

  // Perform request
  db.query('INSERT INTO vm(uuid) VALUES ($1)', req.params.uuid)
    .then(data => {
      return db.query('SELECT * FROM vm WHERE uuid = $1', req.params.uuid);
    })
    .then(data => {
      var vm_id = data[0].id;
      var distribution = req.body;
      console.log('- Distribution: ', distribution);

      distribution.forEach(function(row) {
        db.query('INSERT INTO vm_case(vm_id, case_name) VALUES ($1, $2)', [vm_id, row.case_name]);
      });
      console.log('- Success');
      res.send(200, 'Success');
    })
    .catch(error => {
      console.log('- Unexpected error occurred', error);
      res.send(400, error);
      return next();
    });

  return next();
});

server.del('/dist/:uuid', function (req, res, next) {

  // Notify console/log about the retrieved request
  console.log('Retrieved a request to delete a case distribution');

  // Verify input parameters
  if (!req.params.uuid) {
    console.log(400, '- Parameter "uuid" missing.');
    res.send(400, 'Parameter "uuid" missing.');
    return next();
  }

  // Notify console/log about the uuid
  console.log("- uuid:", req.params.uuid);

  // Perform request
  db.query('DELETE FROM vm WHERE uuid = $1', req.params.uuid)
    .then(data => {
      console.log('- Success');
      res.send(200, 'Success');
    })
    .catch(error => {
      console.log('- Unexpected error occurred', error);
      res.send(400, error);
      return next();
    });

  return next();
});

// Start up the server
server.listen(config.get('General.server.port'), function () {
  console.log('%s listening at %s', server.name, server.url);
});
