import { UserEntity, UserId } from './user.schema.js';

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

	app.get('/profile/get-photo', async (req, res) => {
		res.send(null);
	});

	app.get('/:id', { schema: { params: UserId } }, async (req, res) => {
		const result = await usersCollection.find({
			_id: app.mongo.ObjectId(req.params.id)
		});
		res.send(result);
	});

	app.put(
		'/:id',
		{ schema: { params: UserId, body: UserEntity } },
		async (req, res) => {
			const result = await usersCollection.updateOne(
				{ _id: app.mongo.ObjectId(req.params.id) },
				{ $set: req.body }
			);
			res.send(result);
		}
	);

	app.delete('/:id', { schema: { params: UserId } }, async (req, res) => {
		const result = await usersCollection.deleteOne({
			_id: app.mongo.ObjectId(req.params.id)
		});
		res.send(result);
	});

	done();
}
