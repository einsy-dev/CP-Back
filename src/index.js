import Fastify from 'fastify';
import * as mongodb from '@fastify/mongodb';
import * as jwt from '@fastify/jwt';
import * as env from '@fastify/env';
import * as cors from '@fastify/cors';
import * as fastifyMultipart from '@fastify/multipart';
import { user } from './user/user.controller.js';
import { auth } from './auth/auth.controller.js';
import { schedule } from './schedule/schedule.controller.js';

const fastify = Fastify();
await fastify.register(env, {
	dotenv: true,
	schema: {
		type: 'object',
		properties: {
			MONGODB_URI: { type: 'string' },
			PORT: { type: 'number', default: 3000 },
			SECRET: { type: 'string' }
		},
		required: ['MONGODB_URI', 'SECRET']
	}
});
fastify.register(cors, {
	origin: true
});

fastify.addHook('onRequest', async (req, res) => {
	try {
		if (req.headers.authorization) {
			await req.jwtVerify();
		}
	} catch (err) {
		res.send(err);
	}
});

await fastify.register(mongodb, {
	url: fastify.config.MONGODB_URI,
	forceClose: true
});
fastify.register(jwt, { secret: fastify.config.SECRET });
fastify.register(fastifyMultipart, { attachFieldsToBody: true });
fastify.register(user);
fastify.register(auth, { prefix: '/auth' });
fastify.register(schedule);

fastify.listen({ port: fastify.config.PORT }, function (err) {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	console.log(`Server listening on port ${fastify.config.PORT}`);
});
