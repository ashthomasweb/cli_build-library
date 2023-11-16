import {
    relativeDirectoryArray,
    componentDirectory,
    allCommands,
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

export const srcDirPrompt = [{
    type: 'list',
    name: 'src_directory',
    message: 'In the /src directory?',
    choices: ['Yes', 'No']
}]

export const whatDirPrompt = [{
    type: 'input',
    name: 'what_dir',
    message: 'Where then?',
}]

export const whatFilenamePrompt = [{
    type: 'input',
    name: 'what_filename',
    message: 'What is the file to be called?'
}]

export const renameFilePrompt = [{
    type: 'list',
    name: 'rename',
    message: 'Rename the component?',
    choices: ['Yes', 'No']
}]

export const whatComponentNamePrompt = [{
    type: 'input',
    name: 'what_compname',
    message: 'What is the component to be called?'
}]

export const selectFilePrompt = [{
    type: 'list',
    name: 'selectedFile',
    message: 'Select a file from the directory:',
    choices: () => gatherDynamicFolderContents(componentDirectory)
}]

export const rootFolderPrompt = [{
    type: 'list',
    name: 'root_contents',
    message: 'Navigation',
    choices: () => gatherDynamicFolderContents(relativeDirectoryArray.join('/'))
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
    choices: ['Set /src folder', 'Reset /src folder']
}]


// export const dynamicFolderPrompt = [{
//     type: 'list',
//     name: 'root_contents',
//     message: 'Navigation',
//     choices: () => gatherDynamicFolderContents(pathArray.join('/')),
//     pageSize: 25
// }]

export function generateDynamicPrompt(commandArray = allCommands) {
    const dynamicFolderPrompt = [{
        type: 'list',
        name: 'root_contents',
        message: 'Navigation',
        choices: () => gatherDynamicFolderContents(pathArray.join('/'), commandArray),
        pageSize: 25
    }]
    return dynamicFolderPrompt
}

// const Prompt = [{
//     type: 'list',
//     name: '',
//     message: '',
//     choices:
// }]


// const Prompt = [{
//     type: 'list',
//     name: '',
//     message: '',
//     choices:
// }]