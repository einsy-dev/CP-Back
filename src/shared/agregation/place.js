const placeAgregate = [
	{
		$lookup: {
			from: 'places',
			let: { space_id: '$space_id' },
			pipeline: [
				{
					$match: {
						$expr: { $eq: ['$_id', { $toObjectId: '$$space_id' }] }
					}
				},
				{ $limit: 1 },
				{ $project: { name: 1 } }
			],
			as: 'place'
		}
	},
	{
		$unwind: {
			path: '$place',
			preserveNullAndEmptyArrays: true
		}
	},
	{ $project: { space_id: 0 } }
];

export { placeAgregate };
