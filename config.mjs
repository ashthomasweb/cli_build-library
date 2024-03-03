import { styled } from "./styles.mjs"

/*
-- Config file needs attention. Script needs to be run upon install, pointing the relative directory at the current project.
-- Hard-coded library route needs to be able to be set by user.
-- Hard-coded project route needs to be able to be set by user.
-- Component directory is currently being passed to libraryNav(), and not able to be reset during recursive operation. Disallowing continuous operations after component is copied.
*/

export const relativeDirectoryArray = [`c:`, `Users`, `rideo`, `Dropbox`, 'Code', 'projects', '__active', 'project_cli', '_src-folder', 'cli', `initial-test`] // NEEDS to be set on install to local folder
export const componentDirectory = [...relativeDirectoryArray, 'modularAssets', 'library'] // NEEDS to reference /installedFolder/node_modules/hal/library
export const halRootDirectory = 'c:/Users/rideo/Dropbox/Code/projects/cli/initial-test' // Currently not in use - referenced in setSourceAction()
export const userRootDirectory = 'c:/Users/rideo/Dropbox/Code/projects/cli/hal-test'// Currently not in use - referenced in setSourceAction()
export const bundlesDirectory = [...componentDirectory, 'bundles']

/* Used in prompts for lookups */
export const libraryStyleDirectory = [...relativeDirectoryArray, 'modularAssets', 'stylesheets'] // 'Library' folder needs structure and better naming convention
export const directoriesContainingStyleSheets = ['components', 'views']
export const directoriesWithNoExport = ['servers', 'build']
export const projectComponentStylesFolder = [...relativeDirectoryArray, 'aNewTestFolder', 'scss'] // NEEDS to be set to best practice structure along with proper relativeDirectory and not hard-coded
export const projectMainStylesheet = [...relativeDirectoryArray, 'aNewTestFolder', 'scss', 'styles.scss'] // NEEDS to be set to best practice structure along with proper relativeDirectory and not hard-coded

export const mainMenuChoices = {
    copyFrom: `${styled('Copy', 'yellow')} From Reuseable Component Library`,
    build: `${styled('Start', 'yellow')} New Project Build`,
    explore: `${styled('Explore', 'yellow')} Starting From /src/`,
    createNew: `${styled('Create', 'yellow')} New Blank File or Folder`,
    help: `Display Help Docs`,
    settings: `User Settings`
}

export const navCommandObject = {
    back: 'Back',
    cancel: 'Cancel',
    place: 'Place Here',
    setSRC: 'Set /src Here',
    newFile: 'New File In Current Directory',
    newFolder: 'Create New Folder In Current Directory',
    startBuild: 'Create /src Directory Here'
}

const cmd = navCommandObject

export const standardCommands = [cmd.back, cmd.cancel]
export const defaultCommands = [...standardCommands, cmd.place]
export const settingsCommands = [...standardCommands, cmd.setSRC]
export const newFileFolderCommands = [...standardCommands, cmd.newFile, cmd.newFolder]
export const fromLibraryCommands = [cmd.cancel]
export const placeComponentCommands = [...standardCommands, cmd.newFolder, cmd.place,]
export const newBuildPlacement = [...standardCommands, cmd.startBuild]
