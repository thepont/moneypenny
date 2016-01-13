// Using proxyqyure to miss the require cache.
var proxyquire = require('proxyquire');
var should = require('should');

const TEST_VAR_VALUE = 'TEST_VAR';

var TestEnvormentVarEqual = (envName, varName) => {
	it(`Sets ${varName} to env var ${envName}`, () => { 
		process.env[envName] = TEST_VAR_VALUE;
		var properties = proxyquire('../properties.js', {
			'@global': true
		});
		properties[varName].should.equal(TEST_VAR_VALUE);
	})
}

var ResetEnvAndTestDefault = (defualtValue, envName,  varName)=>{
	it(`Sets ${varName} to default value ${defualtValue} if enviroment var ${varName} is not found` , () => {
		delete process.env[envName];
		var properties = proxyquire('../properties.js', {
			'@global': true
		});
		properties[varName].should.equal(defualtValue);
	});
}

var TestProperty = (defualtValue, envName,  varName) => {
	TestEnvormentVarEqual(envName,  varName);
	ResetEnvAndTestDefault(defualtValue, envName, varName);
}

describe('properties', () => {
	TestProperty('mongo.dev.bigdatr.xyz', 'AU_MONGODB', 'MONGODB');
	TestProperty('toy_auth_manager', 'AU_MONGODB_DB', 'MONGODB_DB');
});