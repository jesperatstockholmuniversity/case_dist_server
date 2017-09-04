var config = require('config');
var assert = require('assert');
var request = require('request');

var hostname = 'http://localhost:' + config.get('General.server.port');

describe('Testing the REST API', function() {
  it('should successfully seed the database', function(done) {
    request(hostname+'/seed', function (error, response, body) {
      response.json = JSON.parse(body);

      assert.equal(error, null);
      assert.equal(response.statusCode, 200);
      assert.equal(response.json.status, 'Success');
      done();
    });
  });

  it('should not find a distribution for the uuid "test-uuid"', function(done) {
    request(hostname+'/dist/test-uuid', function (error, response, body) {
      response.json = JSON.parse(body);

      assert.equal(response.json.status, 'Error');
      assert.equal(response.json.message, 'Distribution not found');
      done();
    });
  });

  it('should fail to create a distribution for the uuid "test-uuid" when the body is not an array', function(done) {
    request({
      url: hostname+'/dist/test-uuid',
      method: 'POST',
      json: {this: "is not an array"}
    },
    function (error, response, body) {
      assert.equal(body.status, 'Error');
      assert.equal(body.message, 'Request body is not an array.');
      done();
    });
  });

  it('should fail to create a distribution for the uuid "test-uuid" when the body array is empty', function(done) {
    request({
      url: hostname+'/dist/test-uuid',
      method: 'POST',
      json: []
    },
    function (error, response, body) {
      assert.equal(body.status, 'Error');
      assert.equal(body.message, 'Request body array empty (length zero).');
      done();
    });
  });

  it('should fail to create a distribution for the uuid "test-uuid" when the body array has an object without a "case_name"-property', function(done) {
    request({
      url: hostname+'/dist/test-uuid',
      method: 'POST',
      json: [{}]
    },
    function (error, response, body) {
      assert.equal(body.status, 'Error');
      assert.equal(body.message, 'Request body array item missing property "case_name"');
      done();
    });
  });

  it('should fail to create a distribution for the uuid "test-uuid" when the body array has an object that is a non-string "case_name"-property', function(done) {
    request({
      url: hostname+'/dist/test-uuid',
      method: 'POST',
      json: [{"case_name": 123}]
    },
    function (error, response, body) {
      assert.equal(body.status, 'Error');
      assert.equal(body.message, 'Request body array item property "case_name" is not a "string".');
      done();
    });
  });

  it('should successfully create a distribution for the uuid "test-uuid" when all required values are set', function(done) {
    request({
      url: hostname+'/dist/test-uuid',
      method: 'POST',
      json: [{"case_name": "test_case_name"}]
    },
    function (error, response, body) {
      assert.equal(body.status, 'Success');
      assert.equal(body.message, '');
      done();
    });
  });
  
  it('should fail to create a distribution for the uuid "test-uuid" when the uuid already has a distribution', function(done) {
    request({
      url: hostname+'/dist/test-uuid',
      method: 'POST',
      json: [{"case_name": "test_case_name"}]
    },
    function (error, response, body) {
      assert.equal(body.status, 'Error');
      assert.equal(body.message, 'Distribution for uuid already exists');
      done();
    });
  });

  it('should retrieve an existing distribution from the database', function(done) {
    request(hostname+'/dist/test-uuid', function (error, response, body) {
      response.json = JSON.parse(body);

      assert.equal(error, null);
      assert.equal(response.statusCode, 200);
      assert.equal(response.json.status, 'Success');
      assert.equal(typeof response.json.message, 'object');
      assert.equal(typeof response.json.message[0].case_name, 'string');
      assert.equal(response.json.message[0].case_name, 'test_case_name');
      done();
    });
  });

  it('should delete an existing distribution from the database', function(done) {
    request({
      url: hostname+'/dist/test-uuid',
      method: 'DELETE'
    },
    function (error, response, body) {
      response.json = JSON.parse(body);

      assert.equal(response.json.status, 'Success');
      assert.equal(response.json.message, '');
      done();
    });
  });

  it('should fail to retrieve a non-existing distribution from the database', function(done) {
    request(hostname+'/dist/test-uuid', function (error, response, body) {
      response.json = JSON.parse(body);

      assert.equal(error, null);
      assert.equal(response.statusCode, 404);
      assert.equal(response.json.status, 'Error');
      assert.equal(response.json.message, 'Distribution not found');
      done();
    });
  });


  it('should fail to delete a non-existing distribution from the database', function(done) {
    request({
      url: hostname+'/dist/test-uuid',
      method: 'DELETE'
    },
    function (error, response, body) {
      response.json = JSON.parse(body);

      assert.equal(response.json.status, 'Error');
      assert.equal(response.json.message, 'Distribution not found');
      done();
    });
  });
});
