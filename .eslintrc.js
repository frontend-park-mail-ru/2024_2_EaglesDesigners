module.exports = {
    env: {
        'browser': true,
        'es2022': true,
        "node": true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser : '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        allowImportExportEverywhere: true,
    },
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        semi: ['warn', 'always'],
        quotes: 'off',
        '@typescript-eslint/no-var-requires': 0,
    },
}