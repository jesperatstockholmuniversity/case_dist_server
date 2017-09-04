var config = require('config');
var assert = require('assert');

var clients = require('restify-clients');

var client = clients.createJsonClient({
  'url': 'http://localhost:' + config.get('General.server.port')
});

describe('Testing the REST API', function() {
  it('should successfully seed the database', function(done) {
    client.get('/seed', function (err, req, res, obj) {
      assert.equal(obj.status, 'Success');
      assert.equal(obj.message, '');
      done();
    });
  });

  it('should not find a distribution for the uuid "test-uuid"', function(done) {
    client.get('/dist/test-uuid', function (err, req, res, obj) {
      assert.equal(obj.status, 'Error');
      assert.equal(obj.message, 'Distribution not found');
      done();
    });
  });

  it('should fail to create a distribution for the uuid "test-uuid" when the body is not an array', function(done) {
    client.post('/dist/test-uuid', function (err, req, res, obj) {
      assert.equal(obj.status, 'Error');
      assert.equal(obj.message, 'Request body is not an array.');
      done();
    });
  });

  it('should fail to create a distribution for the uuid "test-uuid" when the body array is empty', function(done) {
    client.post('/dist/test-uuid', [], function (err, req, res, obj) {
      assert.equal(obj.status, 'Error');
      assert.equal(obj.message, 'Request body array empty (length zero).');
      done();
    });
  });

  it('should fail to create a distribution for the uuid "test-uuid" when the body array has an object without a "case_name"-property', function(done) {
    client.post('/dist/test-uuid', [{}], function (err, req, res, obj) {
      assert.equal(obj.status, 'Error');
      assert.equal(obj.message, 'Request body array item missing property "case_name"');
      done();
    });
  });

  it('should fail to create a distribution for the uuid "test-uuid" when the body array has an object that is a non-string "case_name"-property', function(done) {
    client.post('/dist/test-uuid', [{"case_name": 123}], function (err, req, res, obj) {
      assert.equal(obj.status, 'Error');
      assert.equal(obj.message, 'Request body array item property "case_name" is not a "string".');
      done();
    });
  });

  it('should successfully create a distribution for the uuid "test-uuid" when all required values are set', function(done) {
    client.post('/dist/test-uuid', [{"case_name": "test_case_name"}], function (err, req, res, obj) {
      assert.equal(obj.status, 'Success');
      assert.equal(obj.message, '');
      done();
    });
  });

  it('should fail to create a distribution for the uuid "test-uuid" when the uuid already has a distribution', function(done) {
    client.post('/dist/test-uuid', [{"case_name": "test_case_name"}], function (err, req, res, obj) {
      assert.equal(obj.status, 'Error');
      assert.equal(obj.message, 'Distribution for uuid already exists');
      done();
    });
  });

  it('should retrieve an existing distribution from the database', function(done) {
    client.get('/dist/test-uuid', function (err, req, res, obj) {
      assert.equal(obj.status, 'Success');
      assert.equal(typeof obj.message, 'object');
      assert.equal(typeof obj.message[0], 'object');
      assert.equal(typeof obj.message[0].case_name, 'string');
      assert.equal(obj.message[0].case_name, 'test_case_name');
      done();
    });
  });

  it('should delete an existing distribution from the database', function(done) {
    client.del('/dist/test-uuid', function (err, req, res, obj) {
      assert.equal(obj.status, 'Success');
      assert.equal(obj.message, '');
      done();
    });
  });

  it('should fail to retrieve a non-existing distribution from the database', function(done) {
    client.get('/dist/test-uuid', function (err, req, res, obj) {
      assert.equal(obj.status, 'Error');
      assert.equal(obj.message, 'Distribution not found');
      done();
    });
  });

  it('should fail to delete a non-existing distribution from the database', function(done) {
    client.del('/dist/test-uuid', function (err, req, res, obj) {
      assert.equal(obj.status, 'Error');
      assert.equal(obj.message, 'Distribution not found');
      done();
    });
  });
});
