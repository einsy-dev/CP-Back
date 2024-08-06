const trainerAgregate = [
	{
		$lookup: {
			from: 'users',
			let: { trainer_id: '$trainer_id' },
			pipeline: [
				{
					$match: {
						$expr: { $eq: ['$_id', { $toObjectId: '$$trainer_id' }] }
					}
				},
				{ $limit: 1 },
				{ $project: { firstname: 1, lastname: 1, surname: 1 } }
			],
			as: 'trainer'
		}
	},
	{ $project: { trainer_id: 0 } },
	{
		$unwind: {
			path: '$trainer',
			preserveNullAndEmptyArrays: true
		}
	}
];

export { trainerAgregate };
