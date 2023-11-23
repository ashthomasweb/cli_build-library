#! /usr/bin/env node
import inquirer from 'inquirer'
import * as p from './prompts.js'
import { defaultCommands, mainMenuChoices as mmc } from './config.mjs'
import { libraryNav, nav } from './nav.mjs'
import { newFileFolderCommands, standardCommands } from "./config.mjs"
import { settingsAction } from './inquirerActions.mjs'

inquirer.prompt(p.mainMenuPrompt).then(answers => {

    if (answers.main_menu === mmc.createNew) {

        nav(newFileFolderCommands)

    } else if (answers.main_menu === mmc.copyFrom) {

        libraryNav(defaultCommands)

    } else if (answers.main_menu === mmc.settings) {

        settingsAction()

    } else if (answers.main_menu === mmc.explore) {

        nav(standardCommands)

    } else if (answers.main_menu === mmc.help) {

        console.log('Help docs coming soon!')

    }
}).catch(error => {
    console.error('Error occurred:', error)
})
