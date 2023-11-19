#! /usr/bin/env node
import inquirer from 'inquirer'
import * as p from './prompts.js'
import { mainMenuChoices as mmc } from './config.mjs'
import { libraryNav, nav } from './nav.mjs'
import { newFileFolderCommands } from "./config.mjs"
import { settingsAction } from './inquirerActions.mjs'

inquirer.prompt(p.mainMenuPrompt).then(answers => {

    if (answers.main_menu === mmc.createNew) {

        nav(newFileFolderCommands)

    } else if (answers.main_menu === mmc.copyFrom) {

        libraryNav()

    } else if (answers.main_menu === mmc.settings) {

        settingsAction()

    } else if (answers.main_menu === mmc.explore) {

        nav()

    } else if (answers.main_menu === mmc.help) {

        console.log('Help docs coming soon!')

    }
}).catch(error => {
    console.error('Error occurred:', error)
})
