export const agregateSchedule = [
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
	{
		$unwind: {
			path: '$trainer',
			preserveNullAndEmptyArrays: true
		}
	},
	{
		$lookup: {
			from: 'exercises',
			let: { exercises: '$exercises' },
			pipeline: [
				{
					$match: {
						$expr: {
							$in: [
								'$_id',
								{
									$map: {
										input: '$$exercises.id',
										in: { $toObjectId: '$$this' }
									}
								}
							]
						}
					}
				},
				{ $set: { isComplete: '$$exercises.isComplete' } },
				{ $unwind: '$isComplete' }
			],
			as: 'exercises'
		}
	},
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
	{ $project: { space_id: 0, trainer_id: 0 } },
	{ $sort: { start: 1 } }
];
