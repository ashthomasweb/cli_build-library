/* Primary application directories */
export const relativeDirectoryArray = [`c:`, `Users`, `rideo`, `Dropbox`, 'Code', 'projects', '__active', 'project_cli', '_src-folder', 'cli', `hal`] // NEEDS to be set on install to local folder
export const componentDirectory = [...relativeDirectoryArray, 'src', 'modularAssets', 'library'] // NEEDS to reference /INSTALLLOCATION/node_modules/hal/library !!
export const bundlesDirectory = [...componentDirectory, 'bundles']

/* Used in prompts for lookups */
export const libraryStyleDirectory = [...relativeDirectoryArray, 'src', 'modularAssets', 'stylesheets'] // 'Library' folder needs structure and better naming convention
export const projectComponentStylesFolder = [...relativeDirectoryArray, '_testDirs', 'aNewTestFolder', 'scss'] // !!!! NEEDS to be set to best practice structure along with proper relativeDirectory and not hard-coded
export const projectMainStylesheet = [...relativeDirectoryArray, '_testDirs', 'aNewTestFolder', 'scss', 'styles.scss'] // !!!! NEEDS to be set to best practice structure along with proper relativeDirectory and not hard-coded

/* User settable directories */
export const halRootDirectory = 'c:/Users/rideo/Dropbox/Code/projects/cli/hal' // Currently not in use - referenced in setSourceAction()
export const userRootDirectory = ''// Currently not in use?? - referenced in setSourceAction()