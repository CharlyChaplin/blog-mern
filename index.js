import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import { UserController, PostController } from "./controllers/index.js";
import {checkAuth, handleValidationErrors} from './utils/index.js';
import multer from "multer";
import cors from 'cors';

mongoose
	.connect('mongodb+srv://admin:wwwwww@cluster0.dezs5xl.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => console.log('DB OK'))
	.catch((err) => console.log('DB Error!: ', err))

const app = express();

const storage = multer.diskStorage({
	//когда создаётся хранилище, нужно выполнить функцию destination
	destination: (_, __, cb) => {
		//эта функция мне должна сказать, что она не получает никаких ошибок,
		//и говорю, что нужно сохранить файлы в папку uploads
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	}
});

//указываем, что у multer имеется хранилище в storage
const upload = multer({ storage });

app.use(express.json());
app.use(cors());
//express считает, что обращаясь к http://localhost:4444/uploads/image.img
//что это роут и начинает искать нижеследующие роуты. Нужно объяснить, что
//есть папка, в которой хранятся статичные файлы.
//Говорим, что если придёт любой запрос на роут upload
//.static говорит, что ты делаешь не просто get-запрос,
//а делаешь get-запрос на получение статичного файла
app.use('/upload', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)


//перед тем как выполнить что-то, будем испольовать middleware из multer
//и скажем, что мы ожидаем файл под названием image. То есть мы будем
//ожидать свойство image с какой-то картинкой. Если такой файл придёт,
//то через запятую активируется (req, res)
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	//и что нам необходимо передать url, т.е. вернём клиенту
	//по какому пути сохранилась картинка
	res.json({
		url: `/upload/${req.file.originalname}`
	})
})
app.get('/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.listen(4444, err => {
	return err ? console.log(err) : console.log("Everything is OK")
})