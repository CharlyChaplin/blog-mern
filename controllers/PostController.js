import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec();

		res.json(posts)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: "Fault to get all posts."
		})
	}
}

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();
		
		const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

		res.json(tags);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Fault to get tag"
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;

		//увеличиваем кол-во просмотров через обновление статьи
		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			//что мы хотим обновить и на сколько
			{
				$inc: { viewsCount: 1 },
			},
			//не просто обновить, но обновить и вернуть результат
			{
				returnDocument: 'after',
			},
			//была ошибка или же пришёл документ
			(err, doc) => {
				console.log(doc)
				if (err) {
					console.log(err)
					return res.status(500).json({
						message: "Fault to get one post."
					})
				}
				if (!doc) {
					return res.status(404).json({
						message: "The post not found."
					})
				}

				res.json(doc);
			}
		).populate('user');
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: "Fault to get all posts."
		})
	}
}

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;

		PostModel.findOneAndDelete({
			_id: postId
		}, (err, doc) => {
			if (err) {
				console.log(err);
				return res.status(404).json({
					message: "Fault to delete the post."
				})
			}
			if (!doc) {
				return res.status(404).json({
					message: "The post not found for delete."
				})
			}

			res.json({
				success: true
			})
		})

	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: "Fault to get all posts."
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags.split(',').map(obj => obj.trim()),
			user: req.userId,
		});

		const post = await doc.save();
		res.json(post);

	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: "Fault to creating the post."
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id;
		await PostModel.updateOne(
			{
				_id: postId
			},
			//что мы хотим обновить
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.userId,
				tags: req.body.tags
			});

		res.json({
			success: true
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Fault to update the post."
		})
	}
}