import {
    relativeDirectory,
    componentDirectory,
} from '../initial-test/config.js'
import { gatherDynamicFolderContents } from './utilities.js'
import { pathArray } from './index.js'

export const initialPrompt = [{
    type: 'list',
    name: 'initial_options',
    message: 'Welcome! Here are your basic options:',
    choices: ['Create new file or folder', 'Pick from existing component library', 'Navigate project from /src/', 'User Settings']
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
    choices: () => gatherDynamicFolderContents(relativeDirectory)
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
    choices: ['Set /src folder']
}]


export const dynamicFolderPrompt = [{
    type: 'list',
    name: 'root_contents',
    message: 'Navigation',
    choices: () => gatherDynamicFolderContents(pathArray.join('/'))
}]

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