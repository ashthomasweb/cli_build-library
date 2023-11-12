import { relativeDirectoryArray } from "./config.mjs"
import inquirer from "inquirer"
import * as p from './prompts.js'
import { removeANSICodes } from './styles.mjs'
import { writeFile, stat, mkdir, readFileSync } from 'fs'

export var pathArray = relativeDirectoryArray

export function nav(newContent, compName) {

    inquirer.prompt(p.dynamicFolderPrompt).then((answers) => {
        if (removeANSICodes(answers.root_contents) === 'Back') {
            pathArray = pathArray.slice(0, -1)
            nav()
        } else if (removeANSICodes(answers.root_contents) === 'Cancel') {
            console.log('Goodbye!')
        } else if (removeANSICodes(answers.root_contents) === 'Place Here') {
            writeFile(`${pathArray.join('/')}/${compName}.js`, newContent, (err) => { // TODO: capture file type
                if (err) {
                    console.error('Error writing to file:', err)
                } else {
                    console.log('File content changed successfully.')
                }
            })
        } else {
            stat(pathArray.join('/'), (err, stats) => {
                if (err) {
                    console.error('Error getting file/folder information:', err)
                } else {
                    if (stats.isFile()) {
                        pathArray.push(removeANSICodes(answers.root_contents))
                        nav(newContent, compName)
                    } else if (stats.isDirectory()) {
                        pathArray.push(removeANSICodes(answers.root_contents))
                        nav(newContent, compName)
                    } else {
                        console.log('The selection is neither a file nor a folder.')
                    }
                }
            })
        }
    })
}