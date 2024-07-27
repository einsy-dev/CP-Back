const Place = {
	type: 'object',
	additionalProperties: false,
	properties: {
		name: { type: 'string' },
		description: { type: 'string', default: null }
	},
	required: ['name']
};

const PlaceId = {
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

export { Place, PlaceId };
