var _env = process.env;

module.exports = {
    MONGODB: _env.AU_MONGODB || 'mongo.dev.bigdatr.xyz',
    MONGODB_DB: _env.AU_MONGODB_DB || 'toy_auth_manager'
};
