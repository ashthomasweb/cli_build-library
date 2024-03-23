/* Configuration imports */
import {
    newBuildCommands,
    newFileFolderCommands,
    navCommandObject as cmd,
    setMainStylesheetCommands,
    setStyleFolderCommands,
    setSourceCommands,
} from "../config/config.mjs"

/* Library and Helper imports */
import inquirer from "inquirer"
import * as p from './prompts.js'
import { writeFile, mkdir } from "fs"
import { navHandler } from "../navigation/nav.mjs"
import { bundlesDirectory } from "../config/pathVariables.mjs"
import { halRootDirectory } from "../config/halRootDirectory.mjs"
import { styled } from "../styles/styles.mjs"
import { answerMatch, fsWriteFile } from "../services/utilities.mjs"

export function settingsActions() {
    inquirer.prompt(p.settingsPrompt).then(answers => {
        if (answerMatch(answers.settings, cmd.setSRC)) {
            navHandler('nav', setSourceCommands)
        } else if (answerMatch(answers.settings, cmd.setMainStylesheet)) {
            navHandler('nav', setMainStylesheetCommands)
        } else if (answerMatch(answers.settings, cmd.setStyleFolder)) {
            navHandler('nav', setStyleFolderCommands)
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
                        chosenBundlePath: [...bundlesDirectory, language.toLowerCase(), answers.reactBuilds.toLowerCase()],
                        bundleSelection: answers.selection
                    }
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
                        chosenBundlePath: [...bundlesDirectory, language.toLowerCase(), answers.vueBuilds.toLowerCase()],
                        bundleSelection: answers.selection
                    }
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
                console.log('File created successfully.')
                const options = {
                    navFromCurrentLocation: true,
                    currentPath: path
                }
                navHandler('nav', newFileFolderCommands, options)
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
                const options = {
                    navFromCurrentLocation: true,
                    currentPath: path
                }
                navHandler('nav', newFileFolderCommands, options)
            }
        })
    })
}

export function setSourceAction(pathArray) {
    const pathToVariable = [...halRootDirectory, 'src', 'config', 'projectDirectory.mjs']
    const varPrefix = 'export const projectDirectory = '
    buildArrayExport(pathArray, pathToVariable, varPrefix)
}


export function setProjectStyleFolder(pathArray) {
    const pathToVariable = [...halRootDirectory, 'src', 'config', 'projectStylesFolder.mjs']
    const varPrefix = 'export const projectStylesFolder = '
    buildArrayExport(pathArray, pathToVariable, varPrefix)
}


export function setMainStylesheet(pathArray) {
    const pathToVariable = [...halRootDirectory, 'src', 'config', 'projectMainStylesheet.mjs']
    const varPrefix = 'export const projectMainStylesheet = '
    const isStylesheet = true
    buildArrayExport(pathArray, pathToVariable, varPrefix, isStylesheet)
}

function buildArrayExport(pathArray, pathToVariable, varPrefix, isStylesheet = false) {
    let arrayAsString = `[`
    pathArray.forEach(entry => {
        arrayAsString = arrayAsString +`'${entry}', `
    })
    if (isStylesheet) {
        arrayAsString = arrayAsString + `'styles.scss']`
    } else {
        arrayAsString = arrayAsString.substring(0, arrayAsString.length - 2) + `]`
    }
    const newContent = `${varPrefix}${arrayAsString}`
    fsWriteFile(pathToVariable.join('/'), newContent)
}
