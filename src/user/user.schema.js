const UserEntity = {
	type: 'object',
	properties: {
		firstname: { type: 'string', default: null },
		lastname: { type: 'string', default: null },
		surname: { type: 'string', default: null },
		email: { type: 'string' },
		password: { type: 'string' },
		birthday: { type: 'string', default: null },
		is_man: { type: 'boolean', default: true },
		contact: { type: 'string', default: null },
		avatar: { type: 'number', default: null },
		role: { type: 'string', default: 'student' }
	},
	required: ['email', 'password']
};

const UserId = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
			minLength: 24,
			maxLength: 24
		}
	}
};

// const UserToFind = {
// 	type: 'object',
// 	properties: {
// 		firstname: { type: 'string', default: null },
// 		lastname: { type: 'string', default: null },
// 		surname: { type: 'string', default: null },
// 		email: { type: 'string', default: null }
// 	}
// };

export { UserEntity, UserId };
