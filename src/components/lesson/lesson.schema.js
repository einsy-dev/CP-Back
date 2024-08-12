const post = {
	type: 'object',
	additionalProperties: false,
	properties: {
		space_id: { type: 'string' },
		trainer_id: { type: 'string' },
		trainer_comment: { type: 'string', default: null },
		start: { type: 'string' }
	},
	required: ['space_id', 'trainer_id', 'start']
};

export default { post };
