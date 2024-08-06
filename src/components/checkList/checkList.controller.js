import schema from './checkList.schema.js';

export function checkList(app, options, done) {
	const CheckListCollection = app.mongo.db.collection('checkList');

	app.post(
		'/checkList',
		{ schema: { body: schema.checkList } },
		async (req, res) => {
			const result = await CheckListCollection.insertOne(req.body);
			res.send(result);
		}
	);

	app.get('/checkList', async (req, res) => {
		const result = await CheckListCollection.find(req.body || {}).toArray();
		res.send(result);
	});
	done();
}
