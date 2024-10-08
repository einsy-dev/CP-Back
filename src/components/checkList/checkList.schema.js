const post = {
	type: 'object',
	additionalProperties: false,
	properties: {
		lesson_id: { type: 'string' },
		students: {
			type: 'array',
			items: { type: 'string' }
		},
		exercises: {
			type: 'array',
			items: {
				type: 'object',
				additionalProperties: false,
				properties: {
					id: { type: 'string' },
					isComplete: { type: 'boolean' }
				}
			},
			default: []
		},
		comment: { type: 'string', default: null },
		reward: { type: 'string', default: null },
		isTemplate: { type: 'boolean', default: false }
	},
	required: ['lesson_id']
};

const get = {
	type: 'object',
	additionalProperties: false,
	properties: {
		lesson_id: { type: 'string' },
		student_id: { type: 'string' }
	},
	required: ['lesson_id']
};

export default { post, get };
