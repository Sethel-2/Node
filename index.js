const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const fileRouter = require('./routes/fileRoutes');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const cors = require ("cors");


mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(cors({credentials:true, origin: 'http://localhost:3000'}))
app.use(cookieParser());
app.use(express.json());
app.use('/user', userRouter)
app.use('/order', orderRouter)
app.use('/file', fileRouter)


app.listen(3001, () => {
    console.log(`Server Started at ${3001}`)
})




