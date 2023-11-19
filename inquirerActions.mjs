import inquirer from "inquirer"
import * as p from './prompts.js'
import { nav } from "./nav.mjs"
import { settingsCommands } from "./config.mjs"
import { fsWriteFile } from "./utilities.mjs"
import { readFileSync, writeFile, mkdir } from "fs"
import { halRootDirectory, userRootDirectory } from "./config.mjs"
import { newFileFolderCommands } from "./config.mjs"

export function settingsAction() {
    inquirer.prompt(p.settingsPrompt).then(answers => {
        if (answers.settings === 'Set /src folder') {
            nav(settingsCommands)

        } else if (answers.settings === 'Reset /src folder') {
            console.log('Feature Coming Soon!')
        }
    })
}

export function setSourceAction() {
    inquirer.prompt(p.srcFolderPrompt).then(answers => { // NEED: refactor to not ask for directory
        const data = readFileSync(`${halRootDirectory}/config.js`, 'utf8')
        const userVarReplace = `export const userRootDirectory = '${userRootDirectory}'`
        const varPrefix = 'export const userRootDirectory ='
        const regex = new RegExp(userVarReplace, 'g')
        const newContent = data.replace(regex, `${varPrefix} '${answers.src_folder}'`).toString()
        fsWriteFile(`${halRootDirectory}/config.js`, newContent)
    })
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