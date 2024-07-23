import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
	{
		languageOptions: { globals: globals.node },
		rules: {
			'prettier/prettier': 'error',
			'no-unused-vars': 'warn',
			'no-undef': 'warn'
		}
	},
	pluginJs.configs.recommended,
	eslintPluginPrettierRecommended
];
