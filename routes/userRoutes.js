const { Router } = require ("express");
const UserService = require ("../services/userService");

 const userRouter = Router();
const userService = new UserService();

userRouter.post('/', async (req, res) => {
    console.log(req.body)
  try {
    const user = req.body;


    const createdUser = await userService.registerUser(user);
    res.json(createdUser);
  } catch (error) {
    res.status(error.statusCode ? error.statusCode : 500).json({ message: error.message });
  }
});
userRouter.get('/', async (req, res) => {
    res.json("eradsf")
  //Get all of the saved collections in the database
//   try {
//     const data = await Model.find();
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
});
userRouter.get('/:id', async (req, res) => {
  //Find a specific data collection based on its ID
//   try {
//     const data = await Model.findById(req.params.id);
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
});

//Update by ID Method
userRouter.put('/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const updatedData = req.body;
//     const options = { new: true };

//     const result = await Model.findByIdAndUpdate(id, updatedData, options);

//     res.send(result);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
});

userRouter.delete('/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const data = await Model.findByIdAndDelete(id);
//     res.send(`Document with ${data.name} has been deleted..`);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
});

userRouter.post('/login', async (req, res) => {
    try {
      const {email, password} = req.body;
      console.log(email,password)
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


module.exports = userRouter;