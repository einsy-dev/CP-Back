import { LessonAgregate } from './lesson.agregate.js';
import schema from './lesson.schema.js';

export function Lesson(app, options, done) {
	const LessonsCollection = app.mongo.db.collection('lessons');

	app.post('/lesson', { schema: { body: schema.lesson } }, async (req, res) => {
		const result = await LessonsCollection.insertOne(req.body);
		res.send(result);
	});

	app.get('/lesson', async (req, res) => {
		const result = await LessonsCollection.aggregate([
			{
				$match: {
					start: {
						$gte:
							req.query.start ||
							new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
						$lt:
							req.query.end ||
							new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
					}
				}
			},
			{ $sort: { start: 1 } },
			{ $limit: +req.query.limit || 1 },
			...LessonAgregate
		]).toArray();

		res.send(result);
	});

	app.get(
		'/lesson/:id',
		{ schema: { params: schema.lessonId } },
		async (req, res) => {
			const [result] = await LessonsCollection.aggregate([
				{ $match: { _id: new app.mongo.ObjectId(req.params.id) } },
				...LessonAgregate
			]).toArray();
			res.send(result);
		}
	);

	app.put(
		'/lesson/:id',
		{ schema: { params: schema.lessonId } },
		async (req, res) => {
			const result = await LessonsCollection.updateOne(
				{ _id: new app.mongo.ObjectId(req.params.id) },
				{ $set: req.body }
			);
			res.send(result);
		}
	);

	app.delete(
		'/lesson/:id',
		{ schema: { params: schema.lessonId } },
		async (req, res) => {
			const result = await LessonsCollection.deleteOne({
				_id: app.mongo.ObjectId(req.params.id)
			});
			res.send(result);
		}
	);

	done();
}
