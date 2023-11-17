#! /usr/bin/env node
import {
    relativeDirectoryArray,
    componentDirectory,
    userRootDirectory,
} from './config.mjs'
import inquirer from 'inquirer'
import * as p from './prompts.js'
import { mainMenuChoices as mmc } from './config.mjs'
import { nav } from './nav.mjs'
import { writeFile, mkdir, readFileSync } from 'fs'
import { removeANSICodes } from './styles.mjs'
import { fsWriteFile } from "./utilities.mjs"
import { settingsCommands, newFileCommands } from "./config.mjs"

inquirer.prompt(p.mainMenuPrompt).then(answers => {

    if (answers.main_menu === mmc.createNew) {
        inquirer.prompt(p.srcDirPrompt).then(answers => {
            if (answers.src_directory === 'Yes') {
                inquirer.prompt(p.whatFilenamePrompt).then(answers => {
                    fsWriteFile(`${userRootDirectory}/${answers.what_filename}.txt`, 'Hello, World!')
                }).catch(error => {
                    console.error('Error occurred:', error)
                })
            } else {
                nav(newFileCommands)
            }
        })
    } else if (answers.main_menu === mmc.copyFrom) {
        inquirer.prompt(p.selectFilePrompt).then(answers => {
            const selectedFilePath = `${componentDirectory}/${removeANSICodes(answers.selectedFile)}`
            try {
                const data = readFileSync(selectedFilePath, 'utf8')
                inquirer.prompt(p.renameFilePrompt).then(answers => {
                    if (answers.rename === 'Yes') {
                        inquirer.prompt(p.whatComponentNamePrompt).then(answers => {
                            const newContent = data.replace(/!!NAME!!/g, answers.what_compname).toString()
                            nav(newContent, answers.what_compname)
                        })
                    } else if (answers.rename === 'No') { // TODO: Don't know if this is relevant - should there be a default option and how?
                        inquirer.prompt(p.whatComponentNamePrompt).then(answers => {
                            const newContent = data.replace(/!!NAME!!/g, answers.what_compname)
                            nav(newContent, answers.what_compname)
                        })
                    }
                })
            } catch (err) {
                console.error('Error reading file:', err)
            }
        })
    } else if (answers.main_menu === mmc.settings) {
        inquirer.prompt(p.settingsPrompt).then(answers => {

            if (answers.settings === 'Set /src folder') {
                nav(settingsCommands)
               
            } else if (answers.settings === 'Reset /src folder') {
                console.log('Feature Coming Soon!')
            }

        })

    } else if (answers.main_menu === mmc.explore) {
        nav()
    } else if (answers.main_menu === mmc.help) {
        console.log('Help docs coming soon!')
    }
}).catch(error => {
    console.error('Error occurred:', error)
})
