module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'feat',     // Nova funcionalidade
				'fix',      // Correção de bug
				'docs',     // Apenas documentação
				'style',    // Formatação, sem mudança de código
				'refactor', // Refatoração de código
				'perf',     // Melhoria de performance
				'test',     // Adicionar/modificar testes
				'build',    // Mudanças no sistema de build
				'ci',       // Mudanças em CI/CD
				'chore',    // Outras mudanças que não modificam src ou test
				'revert',   // Reverter um commit anterior
				'wip',      // Work in progress
			],
		],
		'subject-case': [0], // Permite qualquer case no subject
		'subject-max-length': [2, 'always', 100],
		'body-max-line-length': [0], // Desabilita limite de linha no body
	},
};
