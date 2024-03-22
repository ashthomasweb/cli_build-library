import { styled } from "../styles/styles.mjs"

/* Directories used in conditional checks */
export const directoriesContainingStyleSheets = ['components', 'views']
export const directoriesWithNoExport = ['servers', 'build']

export const mainMenuChoices = {
    copyFrom: `${styled('Copy', 'yellow')} From Reuseable Component Library`,
    build: `${styled('Start', 'yellow')} New Project Build`,
    explore: `${styled('Explore', 'yellow')} Starting From /src/`,
    createNew: `${styled('Create', 'yellow')} New Blank File or Folder`,
    help: `Display Help Docs - Coming Soon!`,
    settings: `User Settings - Coming Soon!`
}

export const navCommandObject = {
    up: 'To Parent Directory',
    cancel: 'Cancel',
    reset: 'Start Over',
    place: 'Place Here',
    setSRC: 'Set project (parent of /src) folder',
    newFile: 'New File In Current Directory',
    newFolder: 'Create New Folder In Current Directory',
    startBuild: 'Create /src Directory Here'
}

const cmd = navCommandObject

export const standardNavCommands = [cmd.up, cmd.cancel]
export const defaultCommands = [...standardNavCommands, cmd.place]
export const settingsCommands = [...standardNavCommands, cmd.setSRC]
export const newFileFolderCommands = [...standardNavCommands, cmd.newFile, cmd.newFolder]
export const fromLibraryCommands = [cmd.up, cmd.cancel]
export const placeComponentCommands = [...standardNavCommands, cmd.newFolder, cmd.place,]
export const newBuildPlacement = [...standardNavCommands, cmd.startBuild]
export const newBuildCommands = [cmd.reset, cmd.cancel]
