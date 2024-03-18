/* Configuration imports */

import { 
    settingsCommands, 
    newBuildCommands, 
    newFileFolderCommands 
} from "../config/config.mjs"

// ATTN: Planned feature - User Settings
// import { 
//     halRootDirectory, 
//     userRootDirectory 
// } from "../config/pathVariables.mjs"

/* Library and Helper imports */
import inquirer from "inquirer"
import * as p from './prompts.js'
import { readFileSync, writeFile, mkdir } from "fs"
import { fsWriteFile } from "../services/utilities.mjs"
import { bundleNav, nav } from "../navigation/nav.mjs"

export function settingsActions() {
    inquirer.prompt(p.settingsPrompt).then(answers => {
        if (answers.settings === 'Set /src folder') {
            nav(settingsCommands)
        } else if (answers.settings === 'Reset /src folder') {
            console.log('Feature Coming Soon!')
        }
    })
}

export function newBuildActions() { // TODO: needs language specific handling
    let language
    let build
    inquirer.prompt(p.newBuildPrompt).then(answers => {
        language = answers.language
        if (answers.language === 'React') {
            inquirer.prompt(p.reactBuilds).then(answers => {
                console.log(answers)
                build = answers.reactBuilds
                buildChooser(language, build)
            })
        } else if (answers.language === 'Vue') {
            inquirer.prompt(p.vueBuilds).then(answers => {
                build = answers.vueBuilds
                buildChooser(language, build)
            })
        }
    })
}

export function buildChooser(language, build) {
    const bundleOptions = [
        language.toLowerCase(),
        build.toLowerCase()
    ]
    bundleNav(newBuildCommands, bundleOptions)
}

export function newFileAction(path) {
    const currentDirectory = path.join('/')
    const newContent = `console.log('Hello, World!')`
    inquirer.prompt(p.whatFilenamePrompt).then(answers => {
        writeFile(`${currentDirectory}/${answers.what_filename}`, newContent, (err) => {
            if (err) {
                console.error('Error writing to file:', err)
            } else {
                console.log('File content changed successfully.')
                nav(newFileFolderCommands)
            }
        })
    })
}

export function newFolderAction(path) {
    inquirer.prompt(p.whatDirPrompt).then(answers => {
        const newFolderPath = `${path.join('/')}/${answers.what_dir}`
        mkdir(newFolderPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating directory:', err)
            } else {
                console.log('Directory created successfully!')
                nav(newFileFolderCommands)
            }
        })
    })
}

// ATTN: Planned feature - User Settings
// export function setSourceAction() { 
//     inquirer.prompt(p.srcFolderPrompt).then(answers => {
//         const data = readFileSync(`${halRootDirectory}/config.js`, 'utf8')
//         const userVarReplace = `export const userRootDirectory = '${userRootDirectory}'`
//         const varPrefix = 'export const userRootDirectory ='
//         const regex = new RegExp(userVarReplace, 'g')
//         const newContent = data.replace(regex, `${varPrefix} '${answers.src_folder}'`).toString()
//         fsWriteFile(`${halRootDirectory}/config.js`, newContent)
//     })
// }
