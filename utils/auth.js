const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const RequestError = require('../utils/error')

dotenv.config();

const authenticateAccess = (
  req,
  res,
  next
) => {
  
  try {
    const token = req.cookies.token;
    if (!token || token === "")
      throw new RequestError("Autentikacijos klaida1", 401);
    
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    if (!req.user.id && !req.user.role)
      throw new RequestError("Autentikacijos klaida2", 401);
    next();
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 401)
      .json({ message: error.message });
  }
};

module.exports = authenticateAccess;