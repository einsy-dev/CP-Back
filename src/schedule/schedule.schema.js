const Schedule = {
	type: 'object',
	properties: {
		space_id: { type: 'string' },
		trainer_id: { type: 'string' },
		trainer_comments: { type: 'string', default: null },
		start: { type: 'string' },
		exercises: { type: 'array', default: [] }
	},
	required: ['space_id', 'trainer_id', 'start']
};

const ScheduleId = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
			minLength: 24,
			maxLength: 24
		}
	}
};

export { Schedule, ScheduleId };
