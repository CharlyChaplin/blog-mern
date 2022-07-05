import { validationResult } from 'express-validator';

//если валидация не прошла, то запрос не будет выполнятся
export default (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array());
	}

	next();
}