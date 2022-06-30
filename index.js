import express from "express";
import { validationResult } from "express-validator";
import jsonwebtoken from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { registerValidation } from "./validations/auth.js";
import UserModel from './models/User.js';

mongoose
	.connect('mongodb+srv://admin:wwwwww@cluster0.dezs5xl.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => console.log('DB OK'))
	.catch((err) => console.log('DB Error!: ', err))

const app = express();
const jwt = jsonwebtoken;

app.use(express.json());

app.post('/auth/login', async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })
		if (!user) {
			return res.status(404).json({
				message: 'User not found',
			})
		}

		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
		if (!isValidPass) {
			return res.status(400).json({
				message: "Wrong password"
			})
		};

		const token = jwt.sign({
			_id: user._id,
		},
			'secret123',
			{
				expiresIn: '30d'
			}
		);
		const { passwordHash, ...userData } = user._doc;

		res.json({
			...userData,
			token
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'auth was fault'
		})
	}
})

app.post('/auth/register', registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		})

		const user = await doc.save();

		const token = jwt.sign({
			_id: user._id,
		},
			'secret123',
			{
				expiresIn: '30d'
			}
		)

		const { passwordHash, ...userData } = user._doc;

		res.json({
			...userData,
			token
		});
		res.json({
			success: true,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'register was fault'
		})
	}
})

app.listen(4444, err => {
	return err ? console.log(err) : console.log("Everything is OK")
})