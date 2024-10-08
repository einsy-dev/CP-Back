import Fastify from 'fastify';
import * as mongodb from '@fastify/mongodb';
import * as jwt from '@fastify/jwt';
import * as env from '@fastify/env';
import * as cors from '@fastify/cors';
import * as Static from '@fastify/static';
import * as multipart from '@fastify/multipart';
import * as swagger from '@fastify/swagger';
import * as swaggerUI from '@fastify/swagger-ui';
import {
	user,
	auth,
	place,
	exercise,
	lesson,
	group,
	checkList
} from './components/index.js';

const fastify = Fastify();

fastify.register(swagger);
fastify.register(swaggerUI, {
	routePrefix: '/docs',
	uiConfig: {
		docExpansion: 'list',
		deepLinking: false
	},
	staticCSP: true,
	transformStaticCSP: (header) => header
});

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

fastify.register(Static, {
	root: new URL('../public', import.meta.url),
	wildcard: true
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

fastify.register(mongodb, {
	url: fastify.config.MONGODB_URI,
	forceClose: true
});

fastify.register(jwt, { secret: fastify.config.SECRET });
fastify.register(multipart, {
	attachFieldsToBody: true,
	limits: { fileSize: 6 * 1024 * 1024 }
});
fastify.register(user);
fastify.register(auth, { prefix: '/auth' });
fastify.register(place);
fastify.register(exercise);
fastify.register(lesson);
fastify.register(group);
fastify.register(checkList);

await fastify.ready();
fastify.swagger();

fastify.listen({ port: fastify.config.PORT, host: '0.0.0.0' }, function (err) {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	console.log(`Server listening on port ${fastify.config.PORT}`);
});
