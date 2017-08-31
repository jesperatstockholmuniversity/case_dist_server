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

server.get('/dist/:uuid', function (req, res, next) {

  db.any('select * from vm where uuid = $1', req.params.uuid)
    .then(data => {
        console.log('DATA:', data); // print data;
        res.send(data);
        return data[0];
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
