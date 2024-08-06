const Id = {
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

export { Id };
export default {
	Id
};
