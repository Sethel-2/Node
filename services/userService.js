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

        // TODO: uncomment after email verification is implemented
        // if (!user.isVerified) throw new RequestError("Paskyra nepatvirtinta", 400);
       
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        return { user, token};
      }

      async put(id, user) {
        const { password, ...newUser } = user;
        if (password) newUser.passwordHash = await bcrypt.hash(password, 10);
    
        const oldUser = await this._users.findById(id);
        if (oldUser === null) throw new RequestError("Naudotojas nerastas", 404);
        const emailUser = await this._users.findOne({ email: user.email });
        if (oldUser.email !== user.email && emailUser !== null)
          throw new RequestError("El. paštas užimtas", 400);
    
        Object.assign(oldUser, newUser);
        await oldUser.save();
    
        return oldUser;
      }
  }
  
  module.exports = UserService;