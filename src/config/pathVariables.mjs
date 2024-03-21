import { relativeDirectoryArray } from "./relativeDirectory.mjs"

/* Primary application directories */
export const componentDirectory = [...relativeDirectoryArray, 'src', 'modularAssets', 'library'] // NEEDS to reference /INSTALLLOCATION/node_modules/hal/library !!
export const bundlesDirectory = [...componentDirectory, 'bundles']
export const halRootDirectory = [...relativeDirectoryArray]

/* Used in prompts for lookups */
export const libraryStyleDirectory = [...relativeDirectoryArray, 'src', 'modularAssets', 'stylesheets'] // 'Library' folder needs structure and better naming convention
export const projectComponentStylesFolder = [...relativeDirectoryArray, '_testDirs', 'aNewTestFolder', 'scss'] // !!!! NEEDS to be set to best practice structure along with proper relativeDirectory and not hard-coded
export const projectMainStylesheet = [...relativeDirectoryArray, '_testDirs', 'aNewTestFolder', 'scss', 'styles.scss'] // !!!! NEEDS to be set to best practice structure along with proper relativeDirectory and not hard-coded


