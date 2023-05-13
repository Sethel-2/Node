const User = require("../models/user");
const RequestError = require ( "../utils/error");
const bcrypt = require ("bcrypt");
const jwt = require ("jsonwebtoken");
require('dotenv').config();
 class UserService {
    _users;
  
    constructor() {
      this._users = User;
    };
  
     async registerUser(user) {
        const { password, ...newUser } = user;
        const emailUser = await this._users.findOne({ email: user.email });
        if (emailUser !== null) throw new RequestError("Vartotojas jau egzistuoja", 400);
    
        newUser.passwordHash = await bcrypt.hash(password, 10);
        const createdUser = new this._users(newUser);
        await createdUser.save();
        return createdUser;
    }
    async login(
        email,
        password,
      ) {
        const user = await this._users.findOne({ email });
        if (user === null) throw new RequestError("Nepavyko prisijungti", 401);
    
        const matches = await bcrypt.compare(password, user.passwordHash);
        if (!matches) {
          throw new RequestError("Nepavyko prisijungti", 401);
        }
       
        const token = jwt.sign(
          { id: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        return { user, token};
      }
  }
  
  module.exports = UserService;