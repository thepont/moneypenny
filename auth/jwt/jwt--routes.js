var jwt = require('jsonwebtoken');

var routes = {
    '/auth/jwt' : {
        get : function(req, res){
            var token = jwt.sign(req.user, 'key');
            return res.json(token);
        }
    }
}
module.exports = routes;
