import { UserEntity, UserId } from './user.schema.js';
import * as fs from 'fs';

export function user(app, options, done) {
	const usersCollection = app.mongo.db.collection('users');

	app.post(
		'/user/register',
		{ schema: { body: UserEntity } },
		async (req, res) => {
			const result = await usersCollection.insertOne(req.body);
			res.send(result);
		}
	);

	app.get('/users', async (req, res) => {
		const result = await usersCollection.find(req.body || {}).toArray();
		res.send(result);
	});

	app.get('/profile', async (req, res) => {
		if (!req.user) {
			res.status(401).send({ error: 'Unauthorized' });
			return;
		}
		const result = await usersCollection.findOne({
			_id: new app.mongo.ObjectId(req.user._id)
		});
		if (!result) {
			res.send({ error: 'User not found' });
			return;
		}
		res.send(result);
	});

	// avatar start

	app.post('/profile/set-avatar', async (req, res) => {
		const result = await usersCollection.updateOne(
			{ _id: new app.mongo.ObjectId(req.user._id) },
			{ $set: { avatar: req.body.avatar_id } }
		);
		if (
			fs.existsSync(
				new URL(`../../public/${req.user._id}/avatar.png`, import.meta.url)
			)
		) {
			fs.rmSync(
				new URL(`../../public/${req.user._id}/avatar.png`, import.meta.url)
			);
		}
		res.send(result);
	});

	app.put('/profile/set-photo', async (req, res) => {
		if (!req.user) {
			res.status(401).send({ error: 'Unauthorized' });
			return;
		}

		if (!req.body.file) {
			res.send({ error: 'File not found' });
			return;
		}

		await usersCollection.updateOne(
			{ _id: new app.mongo.ObjectId(req.user._id) },
			{ $set: { avatar: 0 } }
		);

		if (
			!fs.existsSync(new URL(`../../public/${req.user._id}`, import.meta.url))
		) {
			fs.mkdirSync(new URL(`../../public/${req.user._id}`, import.meta.url));
		}

		fs.writeFileSync(
			new URL(`../../public/${req.user._id}/avatar.png`, import.meta.url),
			await req.body.file.toBuffer()
		);
		res.send(null);
	});

	app.get('/profile/get-photo', async (req, res) => {
		if (!req.user) {
			res.status(401).send({ error: 'Unauthorized' });
			return;
		}

		if (
			!fs.existsSync(new URL(`../../public/${req.user._id}`, import.meta.url))
		) {
			res.send(null);
			return;
		}

		const file = new Buffer.from(
			fs.readFileSync(
				new URL(`../../public/${req.user._id}/avatar.png`, import.meta.url)
			)
		).toString('base64');
		res.send({ photo: file });
	});

	app.delete('/profile/remove-photo', async (req, res) => {
		res.send(null);
	});

	// avatar end

	app.get('/user/:id', { schema: { params: UserId } }, async (req, res) => {
		const result = await usersCollection.find({
			_id: new app.mongo.ObjectId(req.params.id)
		});
		res.send(result);
	});

	app.put(
		'/user/:id',
		{ schema: { params: UserId, body: UserEntity } },
		async (req, res) => {
			const result = await usersCollection.updateOne(
				{ _id: app.mongo.ObjectId(req.params.id) },
				{ $set: req.body }
			);
			res.send(result);
		}
	);

	app.delete('/user/:id', { schema: { params: UserId } }, async (req, res) => {
		const result = await usersCollection.deleteOne({
			_id: app.mongo.ObjectId(req.params.id)
		});
		res.send(result);
	});

	done();
}
