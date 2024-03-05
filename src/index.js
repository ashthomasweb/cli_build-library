#! /usr/bin/env node
import inquirer from 'inquirer'
import * as p from './inquirer/prompts.js'
import { defaultCommands, mainMenuChoices as mmc } from './config.mjs'
import { libraryNav, nav } from './navigation/nav.mjs'
import { newFileFolderCommands, standardNavCommands } from "./config.mjs"
import { settingsActions, newBuildActions } from './inquirer/actions.mjs'

inquirer.prompt(p.mainMenuPrompt).then(answers => {

    if (answers.main_menu === mmc.createNew) {
        nav(newFileFolderCommands)
    } else if (answers.main_menu === mmc.build) {
        newBuildActions()
    } else if (answers.main_menu === mmc.copyFrom) {
        libraryNav(defaultCommands)
    } else if (answers.main_menu === mmc.settings) {
        settingsActions()
    } else if (answers.main_menu === mmc.explore) {
        nav(standardNavCommands)
    } else if (answers.main_menu === mmc.help) {
        console.log('Help docs coming soon!')
    }

}).catch(error => {
    console.error('Error occurred:', error)
})
