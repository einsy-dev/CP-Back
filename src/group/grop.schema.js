const Group = {
	type: 'object',
	additionalProperties: false,
	properties: {
		name: { type: 'string' },
		description: { type: 'string', default: null },
		students: { type: 'array', default: [] }
	},
	required: ['name']
};

export { Group };
