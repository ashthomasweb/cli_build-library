/* Configuration imports */

import {
    settingsCommands,
    newBuildCommands,
    newFileFolderCommands,
    navCommandObject as cmd,
} from "../config/config.mjs"

/* Library and Helper imports */
import inquirer from "inquirer"
import * as p from './prompts.js'
import { writeFile, mkdir } from "fs"
import { navHandler } from "../navigation/nav.mjs"
import { bundlesDirectory, halRootDirectory } from "../config/pathVariables.mjs"
import { styled } from "../styles/styles.mjs"
import { fsWriteFile } from "../services/utilities.mjs"

export function settingsActions() {
    inquirer.prompt(p.settingsPrompt).then(answers => {
        if (answers.settings === 'Set /src folder') {
            navHandler('nav', settingsCommands)
        } else if (answers.settings === 'Reset /src folder') {
            console.log('Feature Coming Soon!')
        }
    })
}

export function newBuildActions() { // TODO: needs language specific handling
    let language
    inquirer.prompt(p.newBuildPrompt).then(answers => {
        language = answers.language
        if (answers.language === 'React') {
            inquirer.prompt(p.reactBuilds).then(answers => {
                if (answers.reactBuilds === styled(cmd.reset, 'yellow')) {
                    newBuildActions()
                } else if (answers.reactBuilds === styled(cmd.cancel, 'yellow')) {
                    console.log('Goodbye')
                } else {
                    const options = {
                        bundlePath: [...bundlesDirectory, language.toLowerCase(), answers.reactBuilds.toLowerCase()]
                    }
                    // bundleNav(newBuildCommands, options.bundlePath)
                    navHandler('bundle', newBuildCommands, options)
                }
            })
        } else if (answers.language === 'Vue') {
            inquirer.prompt(p.vueBuilds).then(answers => {
                if (answers.vueBuilds === styled(cmd.reset, 'yellow')) {
                    newBuildActions()
                } else if (answers.vueBuilds === styled(cmd.cancel, 'yellow')) {
                    console.log('Goodbye')
                } else {
                    const options = {
                        bundlePath: [...bundlesDirectory, language.toLowerCase(), answers.vueBuilds.toLowerCase()]
                    }
                    // bundleNav(newBuildCommands, options.bundlePath)
                    navHandler('bundle', newBuildCommands, options)
                }
            })
        } else if (answers.language === 'Start Over') {
            newBuildActions()
        } else if (answers.language === styled(cmd.cancel, 'yellow')) {
            console.log('Goodbye')
        }
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

export function setSourceAction(pathArray) {
    console.log(pathArray)
    const userRootPath = [...halRootDirectory, 'src', 'config', 'userSetRootPath.mjs']
    // const data = readFileSync(userRootPath, 'utf8')
    // const userVarReplace = `export const userRootDirectory = '${userRootDirectory}'`
    // const regex = new RegExp(userVarReplace, 'g')
    const varPrefix = 'export const userRootDirectory = '
    const newContent = `${varPrefix}'${userRootPath.join('/')}'`
    console.log(newContent)
    fsWriteFile(userRootPath.join('/'), newContent)
}
