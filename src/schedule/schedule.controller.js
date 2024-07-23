import { Schedule, ScheduleId } from './schedule.schema.js';

export function schedule(app, options, done) {
	const schedulesCollection = app.mongo.db.collection('schedules');
	const exercisesCollection = app.mongo.db.collection('exercises');

	app.post('/lesson', { schema: { body: Schedule } }, async (req, res) => {
		const result = await schedulesCollection.insertOne(req.body);
		res.send(result);
	});

	app.get('/lesson', async (req, res) => {
		const result = await schedulesCollection
			.aggregate([
				{
					$lookup: {
						from: 'users',
						let: { trainer_id: '$trainer_id' },
						pipeline: [
							{
								$match: {
									$expr: { $eq: ['$_id', { $toObjectId: '$$trainer_id' }] }
								}
							},
							{ $limit: 1 },
							{ $project: { firstname: 1, lastname: 1, surname: 1 } }
						],
						as: 'trainer'
					}
				},
				{
					$unwind: {
						path: '$trainer',
						preserveNullAndEmptyArrays: true
					}
				}
			])
			.toArray();

		res.send(result);
	});

	app.get(
		'/lesson/:id',
		{ schema: { params: ScheduleId } },
		async (req, res) => {
			const result = await schedulesCollection.findOne({
				_id: app.mongo.ObjectId(req.params.id)
			});
			result.exercises = await exercisesCollection
				.find({ _id: { $in: result.exercises } })
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
