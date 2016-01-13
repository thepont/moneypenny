var proxyquire = require('proxyquire');
var sinon = require('sinon');
describe('logger', () => {
	it('Exposes the elephas logger', () =>{
		var fakeLogger = {name: 'fakeLogger'};
		var logger = proxyquire('../logger', {
			'elephas/lib/logger' : fakeLogger
		});
		logger.should.equal(fakeLogger);
	});
});