const generateEslintConfig = require('./index.cjs')

/**
 * @deprecated use the line like below to generate your own config
 */
module.exports = generateEslintConfig({ enableTypescript: true })
