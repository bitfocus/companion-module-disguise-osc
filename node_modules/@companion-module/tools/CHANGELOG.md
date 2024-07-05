# Changelog

## [1.3.1](https://github.com/bitfocus/companion-module-tools/compare/v1.3.0...v1.3.1) (2023-06-08)


### Bug Fixes

* update readme ([def7f19](https://github.com/bitfocus/companion-module-tools/commit/def7f19ff41412d1b85e13beee277b48247a2c6c))

## [1.3.0](https://github.com/bitfocus/companion-module-tools/compare/v1.2.1...v1.3.0) (2023-06-08)


### Features

* add option to build with support for node-gyp-build ([#24](https://github.com/bitfocus/companion-module-tools/issues/24)) ([2a4e311](https://github.com/bitfocus/companion-module-tools/commit/2a4e3115ca26c695d409080d07ef8ad5e6dd840a))
* rework eslint config to be generated to allow further customisation ([e30ae2b](https://github.com/bitfocus/companion-module-tools/commit/e30ae2b23714e858eb333c9be9396d03f187dbee))

## [1.2.1](https://github.com/bitfocus/companion-module-tools/compare/v1.2.0...v1.2.1) (2023-05-12)


### Bug Fixes

* use name from package.json when building externals dependencies object ([6563d0e](https://github.com/bitfocus/companion-module-tools/commit/6563d0e1b23123a056146576e7721c3e2f9e4cfd))

## [1.2.0](https://github.com/bitfocus/companion-module-tools/compare/v1.1.0...v1.2.0) (2023-03-06)


### Features

* flatten directory structure for extra files ([edfff7d](https://github.com/bitfocus/companion-module-tools/commit/edfff7dc2d41d8215cde2b9d9158a08cbecb62e3))

## [1.1.0](https://github.com/bitfocus/companion-module-tools/compare/v1.0.2...v1.1.0) (2023-02-22)


### Features

* add `--dev` parameter to produce a `development` webpack build ([ffb36bc](https://github.com/bitfocus/companion-module-tools/commit/ffb36bcd9cb5109eed0bbb05da22b4ea00745b34))
* allow modules to specify additional webpack plugins ([3dc1f5f](https://github.com/bitfocus/companion-module-tools/commit/3dc1f5f0da879c31dab0395ac6d012ad810ad4ad))

## [1.0.2](https://github.com/bitfocus/companion-module-tools/compare/v1.0.1...v1.0.2) (2023-02-19)


### Bug Fixes

* paths on windows in bash ([85f5438](https://github.com/bitfocus/companion-module-tools/commit/85f5438a57caf0328beb26b18ef55fcab2115665))

## [1.0.1](https://github.com/bitfocus/companion-module-tools/compare/v1.0.0...v1.0.1) (2023-02-17)


### Bug Fixes

* missing prebuilds in built packages ([acd76e8](https://github.com/bitfocus/companion-module-tools/commit/acd76e84ed98916f31d251ddddc0a601514c91c0))

## [1.0.0](https://github.com/bitfocus/companion-module-tools/compare/v0.5.2...v1.0.0) (2023-02-05)


### ⚠ BREAKING CHANGES

* rename webpack-ext.cjs to build-config.cjs

### Features

* rename webpack-ext.cjs to build-config.cjs ([c8864cd](https://github.com/bitfocus/companion-module-tools/commit/c8864cd55306a4ae60c6602cf7c73bf81eb585be))
* support including 'extraFiles' in the built pkg ([b130f57](https://github.com/bitfocus/companion-module-tools/commit/b130f572a13ddef49596ba0a4103d18d22b8a231))

## [0.5.2](https://github.com/bitfocus/companion-module-tools/compare/v0.5.1...v0.5.2) (2023-01-10)


### Bug Fixes

* scripts unable to resolve dependencies ([312caf3](https://github.com/bitfocus/companion-module-tools/commit/312caf36f42bb17965fc010e80bd2184c4bf8a62))

## [0.5.1](https://github.com/bitfocus/companion-module-tools/compare/v0.5.0...v0.5.1) (2022-12-01)


### Bug Fixes

* update minimum @companion-module/base ([5897c0a](https://github.com/bitfocus/companion-module-tools/commit/5897c0a8e4fde6bb0599fb336437193702143b78))

## [0.5.0](https://github.com/bitfocus/companion-module-tools/compare/v0.4.1...v0.5.0) (2022-11-27)


### Features

* support copying native module prebuilt binaries ([3e5610a](https://github.com/bitfocus/companion-module-tools/commit/3e5610a809cbbb8d7ad9844824489ed7f5dedb3a))

## [0.4.1](https://github.com/bitfocus/companion-module-tools/compare/v0.4.0...v0.4.1) (2022-11-26)


### Bug Fixes

* updated tsconfig ([6dd1a05](https://github.com/bitfocus/companion-module-tools/commit/6dd1a0544e5d9f784f276485cb9254b35195f3c1))

## [0.4.0](https://github.com/bitfocus/companion-module-tools/compare/v0.3.3...v0.4.0) (2022-11-26)


### Features

* require node 18 ([f4dfdd2](https://github.com/bitfocus/companion-module-tools/commit/f4dfdd2f510642ca99937100139a65f2903affe9))


### Bug Fixes

* add missing dependency ([eacc0f4](https://github.com/bitfocus/companion-module-tools/commit/eacc0f4e9c4af028905d9a096570ce5f34212733))

## [0.3.3](https://github.com/bitfocus/companion-module-tools/compare/v0.3.2...v0.3.3) (2022-11-22)


### Bug Fixes

* tsconfig recommends commonjs ([1851276](https://github.com/bitfocus/companion-module-tools/commit/1851276f725254ba1338a9d30d8cd32e7dea31b9))

## [0.3.2](https://github.com/bitfocus/companion-module-tools/compare/v0.3.1...v0.3.2) (2022-10-11)


### Bug Fixes

* preserve json files ([6d464b5](https://github.com/bitfocus/companion-module-tools/commit/6d464b5dc30f961e053de71d64ec07e005c542a5))

## [0.3.1](https://github.com/bitfocus/companion-module-tools/compare/v0.3.0...v0.3.1) (2022-10-01)


### Bug Fixes

* errors ([26af195](https://github.com/bitfocus/companion-module-tools/commit/26af195288010c759dd354fc3d9e9d1946a1a16d))

## [0.3.0](https://github.com/bitfocus/companion-module-tools/compare/v0.2.0...v0.3.0) (2022-10-01)


### Features

* validateManifest before building module ([0166c7d](https://github.com/bitfocus/companion-module-tools/commit/0166c7da0ed725de77e3c71bc7992f8fd9deba94))


### Bug Fixes

* generating of manifest incorrectly processing 'products' field ([5f5ad9e](https://github.com/bitfocus/companion-module-tools/commit/5f5ad9e802249e4c9fe60ad8eb2278c715fa0a15))
* update runtime.api in conversion script ([ce95e96](https://github.com/bitfocus/companion-module-tools/commit/ce95e96626023e11ec7fe460278a3418dc6f0eaf))

## [0.2.0](https://github.com/bitfocus/companion-module-tools/compare/v0.1.1...v0.2.0) (2022-09-04)


### Features

* update @companion-module/base ([97742a5](https://github.com/bitfocus/companion-module-tools/commit/97742a58a71e09a93988f0288e661bd5171f14ba))

## [0.1.1](https://github.com/bitfocus/companion-module-tools/compare/v0.1.0...v0.1.1) (2022-07-21)


### Bug Fixes

* don't rename modules ([0d35f51](https://github.com/bitfocus/companion-module-tools/commit/0d35f510cf24333b753d8b34a5c4af27623fcaed))

## [0.1.0](https://github.com/bitfocus/companion-module-tools/compare/v0.0.2...v0.1.0) (2022-07-12)


### Features

* add runtime.apiVersion to manifest ([b42703b](https://github.com/bitfocus/companion-module-tools/commit/b42703b5bac6e2cb6addc8e71239c24e26c43b90))
* remove husky & lint-staged ([7b71d84](https://github.com/bitfocus/companion-module-tools/commit/7b71d84cb8850242846d5118f651fd7ae129615c))


### Bug Fixes

* set `importHelpers: false` for recommended tsconfig ([1b04d89](https://github.com/bitfocus/companion-module-tools/commit/1b04d89bc50922466dffb416b4ed3b4acf63be71))
* set version field in manifest when generating pkg.tgz ([b42703b](https://github.com/bitfocus/companion-module-tools/commit/b42703b5bac6e2cb6addc8e71239c24e26c43b90))
* update @companion-module/base ([33df2a6](https://github.com/bitfocus/companion-module-tools/commit/33df2a61796954c30c01e25a5f08a2a1bd874e64))

## [0.0.2](https://github.com/bitfocus/companion-module-tools/compare/v0.0.1...v0.0.2) (2022-07-10)


### Bug Fixes

* missing webpack config ([a039dee](https://github.com/bitfocus/companion-module-tools/commit/a039deeb7c1736ce87f3bba8759c230de7ad883d))

## 0.0.1 (2022-07-10)


### Features

* initial commit ([c07d9af](https://github.com/bitfocus/companion-module-tools/commit/c07d9af14b2f950ac93095ed1b6e37d0a206ef99))


### Miscellaneous Chores

* update readme ([8a240c5](https://github.com/bitfocus/companion-module-tools/commit/8a240c5bd6ebc14d9f978fd0e14dba41986626da))
