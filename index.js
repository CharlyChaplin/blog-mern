import express from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";

mongoose
	.connect('mongodb+srv://admin:wwwwww@cluster0.dezs5xl.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => console.log('DB OK'))
	.catch((err) => console.log('DB Error!: ', err))

const app = express();

app.use(express.json());

app.post('/auth/login', UserController.login)

app.post('/auth/register', registerValidation, UserController.register)

app.get('/auth/me', checkAuth, UserController.getMe)


app.listen(4444, err => {
	return err ? console.log(err) : console.log("Everything is OK")
})