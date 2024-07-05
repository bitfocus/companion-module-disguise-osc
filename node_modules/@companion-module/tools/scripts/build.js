#!/usr/bin/env node
// The zx shebang doesn't resolve dependencies correctly
import 'zx/globals'

import path from 'path'
import { fs } from 'zx'
import { findUp } from 'find-up'
import * as tar from 'tar'
import { validateManifest } from '@companion-module/base'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

async function findModuleDir(cwd) {
	const stat = await fs.stat(cwd)
	if (stat.isFile()) cwd = path.dirname(cwd)

	const pkgJsonPath = await findUp('package.json', { cwd })
	return path.dirname(pkgJsonPath)
}

// const toolsDir = path.join(__dirname, '..')
const toolsDir = await findModuleDir(require.resolve('@companion-module/tools'))
const frameworkDir = await findModuleDir(require.resolve('@companion-module/base'))
console.log(`Building for: ${process.cwd()}`)

console.log(`Tools path: ${toolsDir}`)
console.log(`Framework path: ${frameworkDir}`)

// clean old
await fs.remove('pkg')

const webpackArgs = {}
if (argv.dev || argv.debug) webpackArgs['env']= 'dev'

const webpackArgsArray = []
for (const [k, v] of Object.entries(webpackArgs)) {
	webpackArgsArray.push(`--${k}`, v)
}

// build the code
const webpackConfig = path.join(toolsDir, 'webpack.config.cjs').replace(/\\/g, '/') // Fix slashes because windows is a pain
await $`yarn webpack -c ${webpackConfig} ${webpackArgsArray}`

// copy in the metadata
await fs.copy('companion', 'pkg/companion')

const srcPackageJson = JSON.parse(await fs.readFile(path.resolve('./package.json')))
const frameworkPackageJson = JSON.parse(await fs.readFile(path.join(frameworkDir, 'package.json')))

// Copy the manifest, overriding some properties
const manifestJson = JSON.parse(await fs.readFile(path.resolve('./companion/manifest.json')))
manifestJson.runtime.entrypoint = '../main.js'
manifestJson.version = srcPackageJson.version
manifestJson.runtime.api = 'nodejs-ipc'
manifestJson.runtime.apiVersion = frameworkPackageJson.version
await fs.writeFile(path.resolve('./pkg/companion/manifest.json'), JSON.stringify(manifestJson))

// Make sure the manifest is valid
try {
	validateManifest(manifestJson)
} catch (e) {
	console.error('Manifest validation failed', e)
	process.exit(1)
}

// Generate a minimal package.json
const packageJson = {
	name: manifestJson.name,
	version: manifestJson.version,
	license: manifestJson.license,
	// Minimal content
	type: 'commonjs',
	dependencies: {},
}

// Ensure that any externals are added as dependencies
const webpackExtPath = path.resolve('build-config.cjs')
if (fs.existsSync(webpackExtPath)) {
	const webpackExt = require(webpackExtPath)

	// Add any external dependencies, with versions matching what is currntly installed
	if (webpackExt.externals) {
		const extArray = Array.isArray(webpackExt.externals) ? webpackExt.externals : [webpackExt.externals]
		for (const extGroup of extArray) {
			if (typeof extGroup === 'object') {
				// TODO - does this need to be a stricter object check?

				for (const external of Object.keys(extGroup)) {
					const extPath = await findUp('package.json', { cwd: require.resolve(external) })
					const extJson = JSON.parse(await fs.readFile(extPath))
					packageJson.dependencies[external] = extJson.version
				}
			}
		}
	}

	// Copy across any prebuilds that can be loaded corectly
	if (webpackExt.prebuilds) {
		await fs.mkdir('pkg/prebuilds')

		for (const lib of webpackExt.prebuilds) {
			const srcDir = await findModuleDir(require.resolve(lib))
			const dirs = await fs.readdir(path.join(srcDir, 'prebuilds'))
			for (const dir of dirs) {
				await fs.copy(path.join(srcDir, 'prebuilds', dir), path.join('pkg/prebuilds', dir))
			}
		}
	}

	// copy extra files
	if (Array.isArray(webpackExt.extraFiles)) {
		const files = await globby(webpackExt.extraFiles)
		for (const file of files) {
			await fs.copy(file, path.join('pkg', path.basename(file)), {
				overwrite: false,
			})
		}
	}
}

// Copy node-gyp-build prebulds
const webpackConfigJson = await require(webpackConfig)(webpackArgs)
if (webpackConfigJson.node?.__dirname === true) {
	const copyNodeGypBuildPrebuilds = (thisPath) => {
		const nodeModPath = path.join(thisPath, 'node_modules')
		if (fs.existsSync(nodeModPath)) {
			for (const dir of fs.readdirSync(nodeModPath)) {
				const modDir = path.join(nodeModPath, dir)
				copyNodeGypBuildPrebuilds(modDir)
			}
		}

		const pkgJsonPath = path.join(thisPath, 'package.json')
		if (thisPath && fs.existsSync(pkgJsonPath)) {
			const dirPkgJsonStr = fs.readFileSync(pkgJsonPath)
			const dirPkgJson = JSON.parse(dirPkgJsonStr.toString())

			const prebuildsDir = path.join(thisPath, 'prebuilds')
			if (dirPkgJson.dependencies?.['node-gyp-build'] && fs.existsSync(prebuildsDir)) {
				fs.mkdirpSync(path.join('pkg', thisPath))
				fs.copySync(prebuildsDir, path.join('pkg', prebuildsDir))
				
				console.log('copying node-gyp-build prebuilds from', thisPath)
			}
		}
	}
	
	copyNodeGypBuildPrebuilds('')
}


// Write the package.json
// packageJson.bundleDependencies = Object.keys(packageJson.dependencies)
await fs.writeFile('pkg/package.json', JSON.stringify(packageJson))

// If we found any depenendencies for the pkg, install them
if (Object.keys(packageJson.dependencies).length) {
	await $`yarn --cwd pkg install`
}

// Create tgz of the build
await tar
	.create(
		{
			gzip: true,
		},
		['pkg']
	)
	.pipe(fs.createWriteStream('pkg.tgz'))
