import { User } from '../models/user.js'
import { RequestError } from '../utils/error.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import sendgrid from '@sendgrid/mail'
dotenv.config()

 export class UserService {
    _users;
  
    constructor() {
      this._users = User;
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
    };

    async getClients({ search = "", page, from, to }) {
      const itemsPerPage = 15;
      const query = { role: "client" };
      if (search) query.fullName = { $regex: search, $options: "i" }
      if (from) query.createdAt = { ...query.createdAt, $gte: from };
      if (to) query.createdAt = { ...query.createdAt, $lte: to };

      const clients = await this._users
        .find(query, undefined, {
          skip: itemsPerPage * page,
          limit: itemsPerPage + 1,
        })
        .select("-passwordHash");

      const nextPageExists = clients.length === itemsPerPage + 1
      if (nextPageExists) clients.pop()
      
      return { clients, nextPageExists };
    }

    async getAllClients() {
      const clients = await this._users
        .find({ role: 'client' })
        .select("-passwordHash");

      return { clients, nextPageExists: false }
    }
  
     async registerUser(user) {
        const { password, ...newUser } = user;
        const emailUser = await this._users.findOne({ email: user.email });
        if (emailUser !== null) throw new RequestError("Vartotojas jau egzistuoja", 400);
    
        newUser.passwordHash = await bcrypt.hash(password, 10);
        const createdUser = new this._users(newUser);
        createdUser.fullName = `${user.firstName} ${user.lastName}`
        await createdUser.save();
        createdUser.passwordHash = '';

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
          { id: user._id, role: user.role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        user.passwordHash = ''
        
        return { user, token };
      }

      async put(id, user) {
        const { password, ...newUser } = user;
        if (password) newUser.passwordHash = await bcrypt.hash(password, 10);
    
        const oldUser = await this._users.findById(id);
        if (oldUser === null) throw new RequestError("Naudotojas nerastas", 404);
        const emailUser = await this._users.findOne({ email: user.email });
        if (oldUser.email !== user.email && emailUser !== null)
          throw new RequestError("El. paštas užimtas", 400);
    
        delete newUser.role
        Object.assign(oldUser, newUser);
        oldUser.fullName = `${oldUser.firstName} ${oldUser.lastName}`
        await oldUser.save();
        oldUser.passwordHash = ''
    
        return oldUser;
      }

      async remindPassword(email) {
        const existingUser = await this._users.findOne({ email });
        if (!existingUser) throw new RequestError("Paskyra su tokiu el. paštu neegzistuoja", 400);

        const token = jwt.sign(
          { id: existingUser._id },
          process.env.PASSWORD_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        const passwordRecoveryLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
        const msg = {
          to: email,
          from: process.env.SENDER_EMAIL || '',
          subject: 'Password reminder',
          html: `<div>Atnaujinti slaptažodį galite <a href="${passwordRecoveryLink}">ČIA</a>. Nuoroda galios vienai dienai.</div`
        };
        const response = await sendgrid.send(msg);
        return response;
      }

      async resetPassword(password, token) {
        let userId = '';

        try {
          const encryptedUser = jwt.verify(token, process.env.PASSWORD_TOKEN_SECRET);
          if (!encryptedUser.id) throw new Error('Id missing')
          userId = encryptedUser.id;
        } catch (error) {
          throw new RequestError("Autentikacijos klaida", 403)
        }

        const user = await this._users.findById(userId);
        if (!user) throw new RequestError("Naudotojas nerastas", 404)
    
        user.passwordHash = await bcrypt.hash(password, 10);
        await user.save();
      }
  }