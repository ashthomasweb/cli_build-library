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

const standardCommands = ['Back', 'Cancel']
export const defaultCommands = [...standardCommands, 'Place Here']
export const settingsCommands = [...standardCommands, 'Set /src Here']
export const newFileCommands = [...standardCommands, 'New File In Current Directory', 'Create New Folder In Current Directory']
