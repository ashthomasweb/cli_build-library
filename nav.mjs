import { newFileCommands, relativeDirectoryArray } from "./config.mjs"
import inquirer from "inquirer"
import * as p from './prompts.js'
import { removeANSICodes } from './styles.mjs'
import { stat, readFileSync, mkdir } from 'fs'
import { fsWriteFile } from "./utilities.mjs"
import { generateDynamicPrompt } from "./prompts.js"
import { defaultCommands } from "./config.mjs"

export var pathArray = relativeDirectoryArray

export function nav(commandArray = defaultCommands, newContent, compName) {

    inquirer.prompt(generateDynamicPrompt(commandArray)).then((answers) => {
        if (removeANSICodes(answers.root_contents) === 'Back') {
            pathArray = pathArray.slice(0, -1)
            nav(commandArray)
        } else if (removeANSICodes(answers.root_contents) === 'Cancel') {
            console.log('Goodbye!')
        } else if (removeANSICodes(answers.root_contents) === 'Place Here') {
            fsWriteFile(`${pathArray.join('/')}/${compName}.js`, newContent)
        } else if (removeANSICodes(answers.root_contents) === 'Set /src Here') {
            inquirer.prompt(p.srcFolderPrompt).then(answers => { // NEED: refactor to not ask for directory
                const data = readFileSync(`${halRootDirectory}/config.js`, 'utf8')
                const userVarReplace = `export const userRootDirectory = '${userRootDirectory}'`
                const varPrefix = 'export const userRootDirectory ='
                const regex = new RegExp(userVarReplace, 'g')
                const newContent = data.replace(regex, `${varPrefix} '${answers.src_folder}'`).toString()
                fsWriteFile(`${halRootDirectory}/config.js`, newContent)
            })
        } else if (removeANSICodes(answers.root_contents) === 'New File In Current Directory') {
            console.log(pathArray.join('/'))
            const currentDirectory = pathArray.join('/')
            inquirer.prompt(p.whatFilenamePrompt).then(answers => {
                fsWriteFile(`${currentDirectory}/${answers.what_filename}`, `console.log('Hello, World!')`)
            })
        } else if (removeANSICodes(answers.root_contents) === 'Create New Folder In Current Directory') {
            inquirer.prompt(p.whatDirPrompt).then(answers => {
                const newFolderPath = `${pathArray.join('/')}/${answers.what_dir}`
                mkdir(newFolderPath, { recursive: true }, (err) => {
                    if (err) {
                        console.error('Error creating directory:', err)
                    } else {
                        console.log('Directory created successfully!')
                        nav(newFileCommands)
                    }
                })
            })
        } else {
            stat(pathArray.join('/'), (err, stats) => {
                if (err) {
                    console.error('Error getting file/folder information:', err)
                } else {
                    if (stats.isFile()) {
                        pathArray.push(removeANSICodes(answers.root_contents))
                        nav(commandArray, newContent, compName)
                    } else if (stats.isDirectory()) {
                        pathArray.push(removeANSICodes(answers.root_contents))
                        nav(commandArray, newContent, compName)
                    } else {
                        console.log('The selection is neither a file nor a folder.')
                    }
                }
            })
        }
    })
}
