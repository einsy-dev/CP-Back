import { agregateSchedule } from './schedule.agregate.js';
import { Schedule, ScheduleId } from './schedule.schema.js';

export function schedule(app, options, done) {
	const schedulesCollection = app.mongo.db.collection('schedules');

	app.post('/lesson', { schema: { body: Schedule } }, async (req, res) => {
		const result = await schedulesCollection.insertOne(req.body);
		res.send(result);
	});

	app.get('/lesson', async (req, res) => {
		const result = await schedulesCollection
			.aggregate([
				{
					$match: {
						start: {
							$gt:
								req.query.start ||
								new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
						}
					}
				},
				{ $limit: req.query.limit || 1 },
				...agregateSchedule
			])
			.toArray();

		res.send(result);
	});

	app.get(
		'/lesson/:id',
		{ schema: { params: ScheduleId } },
		async (req, res) => {
			const result = await schedulesCollection
				.aggregate([
					{
						$match: { $expr: { $eq: ['$_id', { $toObjectId: req.params.id }] } }
					},
					...agregateSchedule
				])
				.toArray();
			res.send(result);
		}
	);

	app.put(
		'/lesson/:id',
		{ schema: { params: ScheduleId } },
		async (req, res) => {
			const result = await schedulesCollection.updateOne(
				{ _id: app.mongo.ObjectId(req.params.id) },
				{ $set: req.body }
			);
			res.send(result);
		}
	);

	app.delete(
		'/lesson/:id',
		{ schema: { params: ScheduleId } },
		async (req, res) => {
			const result = await schedulesCollection.deleteOne({
				_id: app.mongo.ObjectId(req.params.id)
			});
			res.send(result);
		}
	);

	done();
}
