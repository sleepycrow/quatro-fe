module.exports = {
	env: {
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/vue3-recommended',
	],
	rules: {
		'indent': ['error', 'tab'],
		'vue/html-indent': ['error', 'tab'],
		'vue/max-attributes-per-line': 'off',
		'vue/singleline-html-element-content-newline': 'off',
		'vue/no-v-html': 'off',
		'no-prototype-builtins': 'off',
		"no-unused-vars": ['error', { 'argsIgnorePattern': '^_' }]
	},
	globals: {
		'defineProps': 'readonly'
	}
}