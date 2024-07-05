const createFragments = require('./fragments.cjs')

module.exports = function generateEslintConfig(options = {}) {
	const { commonPlugins, tsPlugins, commonExtends, tsExtends, commonRules, tsRules, tsParser } = createFragments(
		options.enableJest
	)

	const disableJest = options.enableJest
		? {
				'jest/globals': false, // Block jest from this
		  }
		: {}
	const allowJest = options.enableJest
		? {
				'jest/globals': true,
				jest: true,
		  }
		: {}

	const result = {
		extends: commonExtends,
		plugins: commonPlugins,
		rules: {
			'prettier/prettier': 'error',
		},
		env: { es2017: true },
		parserOptions: { sourceType: 'module', ecmaVersion: 2022 },
		overrides: [
			// Note: the overrides replace the values defined above, so make sure to extend them if they are needed
			{
				files: ['*.js', '*.cjs', '*.mjs'],
				settings: {
					node: {
						tryExtensions: ['.js', '.json', '.node', '.ts'],
					},
				},
				env: {
					...disableJest,
				},
				rules: {
					...commonRules,
				},
			},
		],
	}

	if (options.enableTypescript) {
		result.overrides.push(
			{
				files: ['*.ts'],
				extends: tsExtends,
				plugins: tsPlugins,
				...tsParser,
				env: {
					...disableJest,
				},
				rules: {
					...commonRules,
					...tsRules,
				},
			},
			{
				files: ['src/**/__tests__/**/*.ts'],
				extends: tsExtends,
				plugins: tsPlugins,
				...tsParser,
				env: {
					...allowJest,
				},
				rules: {
					...commonRules,
					...tsRules,
					'@typescript-eslint/ban-ts-ignore': 'off',
					'@typescript-eslint/ban-ts-comment': 'off',
				},
			},
			{
				files: ['examples/**/*.ts'],
				extends: tsExtends,
				plugins: tsPlugins,
				...tsParser,
				env: {
					...disableJest,
				},
				rules: {
					...commonRules,
					...tsRules,
					'no-process-exit': 'off',
					'n/no-missing-import': 'off',
				},
			}
		)
	}

	return result
}
