const path = require('path')

const frameworkDir = path.relative(process.cwd(), path.resolve('@companion-module/base'))
const pkgJson = require(path.join(process.cwd(), 'package.json'))

if (!pkgJson.main) throw new Error(`Missing main in package.json`)

let webpackExt = {}
try {
	webpackExt = require(path.join(process.cwd(), 'build-config.cjs'))

	console.log('Found additional webpack configuration')
} catch (e) {
	// Ignore
}

let externalsExt = []
if (Array.isArray(webpackExt.externals)) externalsExt = webpackExt.externals
else if (webpackExt.externals) externalsExt = [webpackExt.externals]

module.exports = async (env) => {
	return {
		entry: {
			main: './' + pkgJson.main, // path.join(frameworkDir, 'dist/entrypoint.js'),
			// Allow for custom entrypoints
			...webpackExt.entry,
		},
		mode: env.dev ? 'development' : 'production',
		// devtool: env.dev ? undefined : 'source-map', // TODO - this would be nice, but I think the files have to be uploaded directly to sentry which is problematic...
		output: {
			path: path.resolve(process.cwd(), 'pkg'),
		},
		context: path.resolve(process.cwd(), '.'),
		target: 'node',
		externals: [
			// Allow for custom externals
			...externalsExt,
		],
		experiments: {
			topLevelAwait: true,
		},
		module: {
			rules: [
				// {
				// 	test: /\.json$/,
				// 	type: 'asset/source',
				// },
				// {
				// 	test: /BUILD$/,
				// 	type: 'asset/resource',
				// 	generator: {
				// 		filename: 'BUILD',
				// 	},
				// },
			],
		},
		plugins: [
			// Let modules define additional plugins. Hopefully this won't conflict with anything we add
			...(webpackExt.plugins || []),
		],
		node: webpackExt.useOriginalStructureDirname ? {
			__dirname: true
		} : undefined,
	}
}
