import { Place, PlaceId } from './place.schema.js';

export function place(app, options, done) {
	const placesCollection = app.mongo.db.collection('places');

	app.post('/place', { schema: { body: Place } }, async (req, res) => {
		const result = await placesCollection.insertOne(req.body);
		res.send(result);
	});

	app.get('/place', async (req, res) => {
		const result = await placesCollection.find(req.body || {}).toArray();
		res.send(result);
	});

	app.get('/place/:id', { schema: { params: PlaceId } }, async (req, res) => {
		const result = await placesCollection.findOne({
			_id: new app.mongo.ObjectId(req.params.id)
		});
		res.send(result);
	});

	app.put('/place/:id', { schema: { params: PlaceId } }, async (req, res) => {
		const result = await placesCollection.updateOne(
			{ _id: new app.mongo.ObjectId(req.params.id) },
			{ $set: req.body }
		);
		res.send(result);
	});

	app.delete(
		'/place/:id',
		{ schema: { params: PlaceId } },
		async (req, res) => {
			const result = await placesCollection.deleteOne({
				_id: new app.mongo.ObjectId(req.params.id)
			});
			res.send(result);
		}
	);

	done(0);
}
