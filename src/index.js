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

server.get('/dist/:id', function (req, res, next) {
  // Retrieve a vm distribution for id...
  var distribution = {
    id: "0970c5dce098d3455f5c9c7ecdb75c4d0ddea46d1740aa51a7020066961d42f4",
    cases: [
      {
        name: "Hacker"
      },
      {
        name: "DDOS"
      },
      {
        name: "MySQL_Injection"
      },
    ]
  };
  
  res.send(distribution);
  return next();
});

server.listen(config.get('General.server.port'), function () {
  console.log('%s listening at %s', server.name, server.url);
});
