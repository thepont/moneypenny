var jwt = require('jsonwebtoken');

describe('jwt--routes', () => {
	describe('/auth/jwt', () => {
		describe('GET', () => {
			it('Returns a JWT with the user details', () =>{
				var jwtRoutes = require('../jwt--routes');
				var user = {
					name: 'test'
				}
				var req = {
					user: user
				}
				var res = {
					json: (object) => object
				}
				var ret = jwtRoutes['/auth/jwt'].get(req, res);
				var decoded = jwt.verify(ret, 'key');
				decoded.should.have.property('name', 'test');
			});
		});	
	});
});