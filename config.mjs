import { styled } from "./styles.mjs"
export const relativeDirectoryArray = [`c:`, `Users`, `rideo`, `Dropbox`, 'Code', 'projects', 'cli', `initial-test`]
export const componentDirectory = `${relativeDirectoryArray.join('/')}/library/components`
export const halRootDirectory = 'c:/Users/rideo/Dropbox/Code/projects/cli/initial-test'
export const userRootDirectory = 'c:/Users/rideo/Dropbox/Code/projects/cli/hal-test'


export const mainMenuChoices = {
    copyFrom: {
        text: `${styled('Copy', 'yellow')} From Reuseable Component Library`
    },
    explore: {
        text: `${styled('Explore', 'yellow')} Project From /src/`
    },
    createNew: {
        text: `${styled('Create', 'yellow')} New Blank File or Folder`
    },
    help: {
        text: `Display Help Docs`
    },
    settings: {
        text: `User Settings` 
    }   
}