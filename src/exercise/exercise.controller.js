import { Exercise, ExerciseId } from './exercise.schema.js';

export function exercise(app, options, done) {
	const exercisesCollection = app.mongo.db.collection('exercises');

	app.post('/exercise', { schema: { body: Exercise } }, async (req, res) => {
		const result = await exercisesCollection.insertOne(req.body);
		res.send(result);
	});

	app.get('/exercise', async (req, res) => {
		const result = await exercisesCollection.find(req.body || {}).toArray();
		res.send(result);
	});

	app.get(
		'/exercise/:id',
		{ schema: { params: ExerciseId } },
		async (req, res) => {
			const result = await exercisesCollection.findOne({
				_id: app.mongo.ObjectId(req.params.id)
			});
			res.send(result);
		}
	);

	app.put(
		'/exercise/:id',
		{ schema: { params: ExerciseId } },
		async (req, res) => {
			const result = await exercisesCollection.updateOne(
				{ _id: app.mongo.ObjectId(req.params.id) },
				{ $set: req.body }
			);
			res.send(result);
		}
	);

	app.delete(
		'/exercise/:id',
		{ schema: { params: ExerciseId } },
		async (req, res) => {
			const result = await exercisesCollection.deleteOne({
				_id: app.mongo.ObjectId(req.params.id)
			});
			res.send(result);
		}
	);
	done();
}
