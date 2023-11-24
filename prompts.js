import {
    componentDirectory,
    defaultCommands,
} from './config.mjs'
import { gatherDynamicFolderContents } from './utilities.mjs'
import { pathArray } from './nav.mjs'
import { mainMenuChoices as mmc } from './config.mjs'

export const mainMenuPrompt = [{
    type: 'list',
    name: 'main_menu',
    message: 'Welcome! What would you like to do?',
    choices: [
        mmc.copyFrom,
        mmc.explore,
        mmc.createNew,
        mmc.help,
        mmc.settings
    ]
}]

export const whatDirPrompt = [{
    type: 'input',
    name: 'what_dir',
    message: 'Whats the new folder name?',
}]

export const whatFilenamePrompt = [{
    type: 'input',
    name: 'what_filename',
    message: 'What is the file to be called? Include file extension!'
}]

export const whatComponentNamePrompt = [{
    type: 'input',
    name: 'what_compname',
    message: `What is the component named? i.e - the 'in-file' exported name.` 
}]

export const srcFolderPrompt = [{
    type: 'input',
    name: 'src_folder',
    message: 'Type path of your /src folder',
}]

export const settingsPrompt = [{
    type: 'list',
    name: 'settings',
    message: 'User configurable settings',
    choices: ['Set /src folder', 'Reset /src folder', 'Set style sheet options']
}]

export function generateDynamicPrompt(commandArray = defaultCommands) {
    const dynamicFolderPrompt = [{
        type: 'list',
        name: 'contents',
        message: 'Navigation',
        choices: () => gatherDynamicFolderContents(pathArray.join('/'), commandArray),
        pageSize: 25,
        default: commandArray.length
    }]
    return dynamicFolderPrompt
}

export function generateDynamicLibraryPrompt(commandArray = defaultCommands) {
    const dynamicFolderPrompt = [{
        type: 'list',
        name: 'selection',
        message: 'Navigation',
        choices: () => gatherDynamicFolderContents(componentDirectory.join('/'), commandArray),
        pageSize: 25,
        default: commandArray.length
    }]
    return dynamicFolderPrompt
}
