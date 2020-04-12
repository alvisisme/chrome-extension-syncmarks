const MONGO_SERVER = "localhost";
const MONGO_PORT = 27017;
const MONGO_USER = "root";
const MONGO_PASSWORD = "P9DeuFJ32d4img==";
const MONGO_DB = "data";

const getMongoServer = () => {
  return process.env.MONGO_SERVER || MONGO_SERVER;
};

const getMongoPort = () => {
  return process.env.MONGO_PORT || MONGO_PORT;
};

const getMongoUser = () => {
  return process.env.MONGO_USER || MONGO_USER;
};

const getMongoPassword = () => {
  return process.env.MONGO_PASSWORD || MONGO_PASSWORD;
};

const getMongoDB = () => {
  return process.env.MONGO_DB || MONGO_DB;
};

const getMongoUrl = () => {
  return (
    process.env.MONGO_URL ||
    `mongodb://${getMongoUser()}:${getMongoPassword()}@${getMongoServer()}:${getMongoPort()}`
  );
};

exports.getMongoServer = getMongoServer;
exports.getMongoPort = getMongoPort;
exports.getMongoUser = getMongoUser;
exports.getMongoPassword = getMongoPassword;
exports.getMongoDB = getMongoDB;
exports.getMongoUrl = getMongoUrl;
