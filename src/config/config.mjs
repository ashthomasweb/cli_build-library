import { styled } from "../styles/styles.mjs"

/* Directories used in conditional checks */
export const directoriesContainingStyleSheets = ['components', 'views']
export const directoriesWithNoExport = ['servers', 'build']

export const mainMenuChoices = {
    copyFrom: `${styled('Copy', 'yellow')} From Reuseable Component Library`,
    build: `${styled('Start', 'yellow')} New Project Build`,
    explore: `${styled('Explore', 'yellow')} Starting From Your Project Folder`,
    createNew: `${styled('Create', 'yellow')} New Blank File or Folder`,
    help: `Display Help Docs - Coming Soon!`,
    settings: `User Settings`
}

export const navCommandObject = {
    up: 'To Parent Directory',
    cancel: 'Cancel',
    reset: 'Start Over',
    place: 'Place Here',
    setSRC: 'Set project folder (folder containing your /src directory)',
    setStyleFolder: 'Set project style folder',
    setMainStylesheet: 'Set project main style sheet',
    mainStyleHere: 'Main style sheet (styles.scss) is in this folder',
    newFile: 'New File In Current Directory',
    newFolder: 'Create New Folder In Current Directory',
    startBuild: 'Create /src Directory Here'
}

const cmd = navCommandObject

export const standardNavCommands = [cmd.up, cmd.cancel]
export const defaultCommands = [...standardNavCommands, cmd.place]
export const setSourceCommands = [...standardNavCommands, cmd.setSRC]
export const setMainStylesheetCommands = [...standardNavCommands, cmd.mainStyleHere]
export const setStyleFolderCommands = [...standardNavCommands, cmd.setStyleFolder]
export const newFileFolderCommands = [...standardNavCommands, cmd.newFile, cmd.newFolder]
export const fromLibraryCommands = [...standardNavCommands]
export const placeComponentCommands = [...standardNavCommands, cmd.newFolder, cmd.place,]
export const newBuildPlacement = [...standardNavCommands, cmd.startBuild]
export const newBuildCommands = [cmd.reset, cmd.cancel]
