#! /usr/bin/env node
import {
    relativeDirectoryArray,
    componentDirectory,
    halRootDirectory,
    userRootDirectory,
} from './config.mjs'
import inquirer from 'inquirer'
import * as p from './prompts.js'
import { mainMenuChoices as mmc } from './config.mjs'
import { nav } from './nav.mjs'
import { writeFile, stat, mkdir, readFileSync } from 'fs'
import { removeANSICodes } from './styles.mjs'




inquirer.prompt(p.mainMenuPrompt).then(answers => {

    if (answers.main_menu === mmc.createNew.text) {
        inquirer.prompt(p.srcDirPrompt).then(answers => {
            if (answers.src_directory === 'Yes') {
                inquirer.prompt(p.whatFilenamePrompt).then(answers => {
                    writeFile(`${userRootDirectory}/${answers.what_filename}.txt`, 'Hello, World!', (err) => {
                        if (err) {
                            console.error('Error creating the file:', err)
                        } else {
                            console.log('File created successfully!')
                        }
                    })
                }).catch(error => {
                    console.error('Error occurred:', error)
                })
            } else {
                inquirer.prompt(p.whatDirPrompt).then(answers => {
                    const what_dir = answers.what_dir
                    inquirer.prompt(p.whatFilenamePrompt).then(answers => {
                        mkdir(`${relativeDirectoryArray.join('/')}/${what_dir}`, { recursive: true }, (err) => {
                            if (err) {
                                console.error('Error creating directory:', err)
                            } else {
                                console.log('Directory created successfully!')
                                writeFile(`${relativeDirectoryArray.join('/')}/${what_dir}/${answers.what_filename}`, `console.log('Hello, World!')`, (err) => {
                                    if (err) {
                                        console.error('Error creating the file:', err)
                                    } else {
                                        console.log('File created successfully!')
                                    }
                                })
                            }
                        })
                    })
                }).catch(error => {
                    console.error('Error occurred in what_dir block:', error)
                })
            }
        })
    } else if (answers.main_menu === mmc.copyFrom.text) {
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
    } else if (answers.main_menu === mmc.settings.text) {
        inquirer.prompt(p.settingsPrompt).then(answers => {

            if (answers.settings === 'Set /src folder') {

                inquirer.prompt(p.srcFolderPrompt).then(answers => {
                    const data = readFileSync(`${halRootDirectory}/config.js`, 'utf8')
                    const userVarReplace = `export const userRootDirectory = '${userRootDirectory}'`
                    const varPrefix = 'export const userRootDirectory ='
                    const regex = new RegExp(userVarReplace, 'g')
                    const newContent = data.replace(regex, `${varPrefix} '${answers.src_folder}'`).toString()
                    writeFile(`${halRootDirectory}/config.js`, newContent, (err) => { // TODO: capture file type
                        if (err) {
                            console.error('Error writing to file:', err)
                        } else {
                            console.log('File content changed successfully.')
                        }
                    })
                })
            } else if (answers.settings === 'Reset /src folder') {
                console.log('Feature Coming Soon!')
            }

        })

    } else if (answers.main_menu === mmc.explore.text) {
        nav()
    } else if (answers.main_menu === mmc.help.text) {
        console.log('Help docs coming soon!')
    }
}).catch(error => {
    console.error('Error occurred:', error)
})
