import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { RequestError } from '../utils/error.js'

dotenv.config();

export const authenticateAccess = (
  req,
  res,
  next,
  role = '',
) => {
  try {
    const token = req.cookies.token;
    if (!token || token === "")
      throw new RequestError("Autentikacijos klaida", 401);
    
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    if (!req.user.id && !req.user.role)
      throw new RequestError("Autentikacijos klaida", 401);

    if (role && user.role !== role) throw new RequestError("Operacija uždrausta", 403)
    next();
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 401)
      .json({ message: error.message });
  }
};

export const authenticateCertificator = (req, res, next) => {
  authenticateAccess(req, res, next, 'certificator')
}