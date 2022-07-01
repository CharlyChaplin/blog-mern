import { body } from "express-validator";

export const registerValidation = [
	body('email', 'Wrong e-mail format').isEmail(),
	body('password', "The password must be 5 symbols at least").isLength({min: 5}),
	body('fullName', "Enter a name").isLength({min: 3}),
	body('avatarUrl', "Wrong the link for the avatar").optional().isURL(),
]