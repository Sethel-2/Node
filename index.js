// const cookieParser = require('cookie-parser');
// const userRouter = require('./routes/userRoutes');
// const orderRouter = require('./routes/orderRoutes');
// const fileRouter = require('./routes/fileRoutes');
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require ("cors");
// const firebase = require('./utils/firebase');
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { userRouter } from "./routes/userRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";
import { fileRouter } from "./routes/fileRoutes.js";
import express from "express";
dotenv.config();

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
app.use("/user", userRouter);
app.use("/order", orderRouter);
app.use("/file", fileRouter);
app.use(express.json({ limit: "16mb" }));

app.listen(3001, () => {
  console.log(`Server Started at ${3001}`);
});
