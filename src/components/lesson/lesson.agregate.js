export const LessonAgregate = [
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
										input: '$$exercises',
										in: { $toObjectId: '$$this.id' }
									}
								}
							]
						}
					}
				},
				{
					$project: {
						name: 1,
						img: 1,
						description: 1,
						isComplete: {
							$reduce: {
								input: '$$exercises',
								initialValue: false,
								in: {
									$cond: [
										{
											$eq: ['$_id', { $toObjectId: '$$this.id' }]
										},
										'$$this.isComplete',
										'$$value'
									]
								}
							}
						}
					}
				},
				{ $sort: { start: 1 } }
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
