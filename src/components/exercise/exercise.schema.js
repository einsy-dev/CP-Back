const Exercise = {
	type: 'object',
	additionalProperties: false,
	properties: {
		img: { type: 'number', default: null },
		name: { type: 'string' },
		description: { type: 'string', default: null }
	},
	required: ['name']
};

const ExerciseId = {
	type: 'object',
	additionalProperties: false,
	properties: {
		id: {
			type: 'string',
			minLength: 24,
			maxLength: 24
		}
	}
};

export { Exercise, ExerciseId };
