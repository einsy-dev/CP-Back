export function auth(app, options, done) {
	const usersCollection = app.mongo.db.collection('users');
	app.post('/login', async (req, res) => {
		const { username, password } = req.body;
		const user = await usersCollection.findOne({
			email: username.value,
			password: password.value
		});
		if (!user) {
			res.send({ error: 'Invalid email or password' });
			return;
		}
		const { _id, role } = user;
		const access_token = app.jwt.sign({ _id, role });
		res.send({ access_token });
	});

	app.post('/refresh-token', async () => {
		// TODO
	});

	app.post('/logout', async (req, res) => {
		res.send({
			message: 'Вы успешно вышли из учетной записи.'
		});
	});

	done();
}
