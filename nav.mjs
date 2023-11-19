import { newFileFolderCommands, relativeDirectoryArray, componentDirectory, defaultCommands, fromLibraryCommands } from "./config.mjs"
import inquirer from "inquirer"
import * as p from './prompts.js'
import { clearANSI } from './styles.mjs'
import { stat, readFileSync, mkdir, writeFile } from 'fs'
import { fsWriteFile, gatherDynamicFolderContents } from "./utilities.mjs"
import { setSourceAction, newFileAction, newFolderAction } from "./inquirerActions.mjs"
import { navCommandObject as cmd } from "./config.mjs"
import { answerMatch } from "./utilities.mjs"

export var pathArray = relativeDirectoryArray

export function nav(commandArray = defaultCommands, newContent, compName) {

    inquirer.prompt(p.generateDynamicPrompt(commandArray)).then((answers) => {
        if (answerMatch(answers.contents, cmd.back)) {
            pathArray = pathArray.slice(0, -1)
            nav(commandArray)
        } else if (clearANSI(answers.contents) === 'Cancel') {
            console.log('Goodbye!')
        } else if (clearANSI(answers.contents) === 'Place Here') {
            fsWriteFile(`${pathArray.join('/')}/${compName}`, newContent)
        } else if (clearANSI(answers.contents) === 'Set /src Here') {
            setSourceAction()
        } else if (clearANSI(answers.contents) === 'New File In Current Directory') {
            newFileAction(pathArray)
        } else if (clearANSI(answers.contents) === 'Create New Folder In Current Directory') {
            newFolderAction(pathArray)
        } else {
            stat(pathArray.join('/'), (err, stats) => {
                if (err) {
                    console.error('Error getting file/folder information:', err)
                } else {
                    if (stats.isFile()) {
                        pathArray.push(clearANSI(answers.contents))
                        nav(commandArray, newContent, compName)
                    } else if (stats.isDirectory()) {
                        pathArray.push(clearANSI(answers.contents))
                        nav(commandArray, newContent, compName)
                    } else {
                        console.log('The selection is neither a file nor a folder.')
                    }
                }
            })
        }
    })
}

export function libraryNav() {
    inquirer.prompt(p.generateDynamicLibraryPrompt(fromLibraryCommands)).then(answers => {
        const selectedFilePath = `${componentDirectory}/${clearANSI(answers.selected_file)}`
        try {
            const data = readFileSync(selectedFilePath, 'utf8')
            inquirer.prompt(p.whatFilenamePrompt).then(answers => {
                const fileName = answers.what_filename
                inquirer.prompt(p.whatComponentNamePrompt).then(answers => {
                    const fileContent = data.replace(/!!NAME!!/g, answers.what_compname).toString()
                    nav(undefined, fileContent, fileName)
                })
            })
        } catch (err) {
            console.error('Error reading file:', err)
        }
    })
}
