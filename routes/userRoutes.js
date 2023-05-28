import { Router } from "express";
import { UserService } from "../services/userService.js";
import { authenticateAccess } from "../utils/auth.js";
import { RequestError } from "../utils/error.js";

export const userRouter = Router();
const userService = new UserService();

userRouter.get('/', authenticateAccess, async (req, res) => {
  try {
    const search = req.query.search;
    const page = req.query.page || 1;
    const createdFrom = req.query.from ? new Date(parseInt(req.query.from)) : undefined;
    const createdTo = req.query.to ? new Date(parseInt(req.query.to)) : undefined;
    const showAll = req.query.showAll;
    const { clients, nextPageExists } = showAll
    ? await userService.getAllClients()
    : await userService.getClients({
        search,
        page: page - 1,
        from: createdFrom,
        to: createdTo,
      });
    res.json({ clients, nextPageExists });
  } catch (error) {
    res.status(error.statusCode ? error.statusCode : 500).json({ message: error.message });
  }
});

userRouter.post('/', async (req, res) => {
  try {
    const user = req.body;
    const createdUser = await userService.registerUser(user);
    res.json(createdUser);
  } catch (error) {
    res.status(error.statusCode ? error.statusCode : 500).json({ message: error.message });
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    const {user,token} = await userService.login(email,password);
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.json(user);
  } catch (error) {
    res.status(error.statusCode ? error.statusCode : 500).json({ message: error.message });
  }
});

userRouter.post('/logout', async (req, res) => {
      res.clearCookie("token");
      res.json({ message: "User logged out" })
});

userRouter.post('/remind-password', async (req, res) => {
    try {
      const { email } = req.body;
      await userService.remindPassword(email);
      res.json({ message: "Laiškas išsiųstas" });
    } catch (error) {
      res.status(error.statusCode ? error.statusCode : 500).json({ message: error.message });
    }
})

userRouter.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    await userService.resetPassword(password, token);
    res.json({ message: "Slaptažodis atnaujintas"});
  } catch (error) {
    res.status(error.statusCode ? error.statusCode : 500).json({ message: error.message });
  }
})

userRouter.put('/:id', authenticateAccess, async (req, res) => {
  try {
    const user = req.body;
    if (req.params.id !== req.user.id) throw new RequestError("Prieigos klaida", 403);
    const updatedUser = await userService.put(req.params.id, user);
    res.json(updatedUser)
  } catch (error) {
    res.status(error.statusCode ? error.statusCode : 500).json({ message: error.message });
  }
});

