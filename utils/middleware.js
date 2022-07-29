const jwt = require("jsonwebtoken");

const logger = require("./logger");
const User = require("../models/user");

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "CastError") {
    return response.status(400).json({ error: "invalid id" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).json({ error: "invalid token" });
  }

  next(error);
};

const getToken = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }

  next();
};

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (decodedToken.id) {
      request.user = await User.findById(decodedToken.id);
      return next();
    }
  }

  response.status(401).json({ error: "token missing or invalid" });
  next();
};

module.exports = {
  errorHandler,
  getToken,
  userExtractor,
};
