module.exports = {
	'env': {
		'browser': false,
		'es2021': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended'
	],
	'overrides': [
		{
			'env': {
				'node': true
			},
			'files': [
				'**/*.{ts,js,cjs}'
			],
			'parserOptions': {
				'sourceType': 'script'
			}
		}
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'plugins': [
		'@typescript-eslint'
	],
	'rules': {
		'no-extra-boolean-cast': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'quotes': [
			'error', 'single', {
				'allowTemplateLiterals': true
			}
		],
		// No semi colon:
		'semi': [
			'error', 'never'
		],
		// Indentation:
		'indent': ['error', 'tab']
	},
	
}
