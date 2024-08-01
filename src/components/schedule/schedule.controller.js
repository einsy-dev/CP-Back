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
				...agregateSchedule
			])
			.toArray();

		res.send(result);
	});

	app.get(
		'/lesson/:id',
		{ schema: { params: ScheduleId } },
		async (req, res) => {
			const [result] = await schedulesCollection
				.aggregate([
					{ $match: { _id: new app.mongo.ObjectId(req.params.id) } },
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
				{ _id: new app.mongo.ObjectId(req.params.id) },
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
