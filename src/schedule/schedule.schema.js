const Schedule = {
	type: 'object',
	additionalProperties: false,
	properties: {
		space_id: { type: 'string' },
		trainer_id: { type: 'string' },
		trainer_comments: { type: 'string', default: null },
		start: { type: 'string', default: new Date().toISOString() },
		exercises: { type: 'array', default: [] }
	},
	required: ['space_id', 'trainer_id', 'start']
};

const ScheduleId = {
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

export { Schedule, ScheduleId };
