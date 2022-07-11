import { body } from "express-validator";

export const loginValidation = [
	body('email', 'Wrong e-mail format').isEmail(),
	body('password', "The password must be 5 symbols at least").isLength({min: 5}),
];

export const registerValidation = [
	body('email', 'Wrong e-mail format').isEmail(),
	body('password', "The password must be 5 symbols at least").isLength({min: 5}),
	body('fullName', "Enter a name").isLength({min: 3}),
	body('avatarUrl', "Wrong the link for the avatar").optional().isURL(),
];

export const postCreateValidation = [
	body("title", "Enter the post's head").isLength({min: 3}).isString(),
	body("text", "Length is too short.").isLength({min: 10}).isString(),
	body("tags", "Wrong tag's format (It must be array)").optional().isString(),
	body("imageUrl", "Wrong the link for the image").optional().isString()
];