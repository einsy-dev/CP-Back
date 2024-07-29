import { Group } from './grop.schema.js';
export function group(app, options, done) {
	const groupsCollection = app.mongo.db.collection('groups');

	app.post('/group', { schema: { body: Group } }, async (req, res) => {
		const result = await groupsCollection.insertOne(req.body);
		res.send(result);
	});

	app.get('/group', async (req, res) => {
		const result = await groupsCollection.find(req.body || {}).toArray();
		res.send({ records: result });
	});
	done();
}
