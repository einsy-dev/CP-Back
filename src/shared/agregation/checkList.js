const checkListAgregate = [
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
				}
			],
			as: 'exercises'
		}
	}
];

export { checkListAgregate };
