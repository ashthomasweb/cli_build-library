import { styled } from "./styles.mjs"

export const relativeDirectoryArray = [`c:`, `Users`, `rideo`, `Dropbox`, 'Code', 'projects', 'cli', `initial-test`] // NEEDS to be set on install to local folder
export const componentDirectory = [...relativeDirectoryArray, 'library'] // NEEDS to reference /installedFolder/node_modules/hal/library
export const halRootDirectory = 'c:/Users/rideo/Dropbox/Code/projects/cli/initial-test' // Currently not in use - referenced in setSourceAction()
export const userRootDirectory = 'c:/Users/rideo/Dropbox/Code/projects/cli/hal-test'// Currently not in use - referenced in setSourceAction()

/* Used in prompts for lookups */
export const libraryStyleDirectory = [...relativeDirectoryArray, 'compStyles'] // 'Library' folder needs structure and better naming convention
export const directoriesContainingStyleSheets = ['components', 'views']
export const directoriesWithNoExport = ['servers']
export const projectComponentStylesFolder = [...relativeDirectoryArray, 'newTestFolder', 'scss'] // NEEDS to be set to best practice structure along with proper relativeDirectory
export const projectMainStylesheet = [...relativeDirectoryArray, 'newTestFolder', 'scss', 'styles.scss'] // NEEDS to be set to best practice structure along with proper relativeDirectory

export const mainMenuChoices = {
    copyFrom: `${styled('Copy', 'yellow')} From Reuseable Component Library`,
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
}

const cmd = navCommandObject

export const standardCommands = [cmd.back, cmd.cancel]
export const defaultCommands = [...standardCommands, cmd.place]
export const settingsCommands = [...standardCommands, cmd.setSRC]
export const newFileFolderCommands = [...standardCommands, cmd.newFile, cmd.newFolder]
export const fromLibraryCommands = [cmd.cancel]
export const placeComponentCommands = [...standardCommands, cmd.newFolder, cmd.place,]
