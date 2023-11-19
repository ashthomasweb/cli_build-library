import { styled } from "./styles.mjs"

export const relativeDirectoryArray = [`c:`, `Users`, `rideo`, `Dropbox`, 'Code', 'projects', 'cli', `initial-test`]
export const componentDirectory = `${relativeDirectoryArray.join('/')}/library/components`
export const halRootDirectory = 'c:/Users/rideo/Dropbox/Code/projects/cli/initial-test'
export const userRootDirectory = 'c:/Users/rideo/Dropbox/Code/projects/cli/hal-test'

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

const standardCommands = [cmd.back, cmd.cancel]
export const defaultCommands = [...standardCommands, cmd.place]
export const settingsCommands = [...standardCommands, cmd.setSRC]
export const newFileFolderCommands = [...standardCommands, cmd.newFile, cmd.newFolder]
export const fromLibraryCommands = [cmd.cancel]
