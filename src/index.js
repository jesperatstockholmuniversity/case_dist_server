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
  res.send(req.params);
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
  db.any("SELECT case_name FROM vm_case WHERE vm_id = (SELECT id FROM vm WHERE uuid = $1)", req.params.uuid)
    .then(data => {
        console.log('DATA:', data); // print data;
        res.send(data);
        return data;
    })
    .catch(error => {
        console.log('ERROR:', error); // print the error;
        res.send(error);
    });
  return next();
});

server.post('/dist/:uuid', function (req, res, next) {
  var vm_id = -1;
  db.query("INSERT INTO vm(uuid) VALUES ($1)", req.params.uuid)
    .then(data => {
      return db.query("SELECT * FROM vm WHERE uuid = $1", req.params.uuid);
    })
    .then(data => {
      vm_id = data[0].id;
      req.body.forEach(function(row) {
        db.query("INSERT INTO vm_case(vm_id, case_name) VALUES ($1, $2)", [vm_id, row.case_name]);
      });
      res.send(data);
      return data;
    })
    .catch(error => {
        console.log('ERROR:', error); // print the error;
        res.send(error);
    });
  return next();
});

server.listen(config.get('General.server.port'), function () {
  console.log('%s listening at %s', server.name, server.url);
});
