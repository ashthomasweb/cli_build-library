#! /usr/bin/env node
import { 
    defaultCommands, 
    mainMenuChoices as choices, 
    newFileFolderCommands, 
    standardNavCommands 
} from './config/config.mjs'
import inquirer from 'inquirer'
import * as p from './inquirer/prompts.js'
import { 
    // settingsActions, // ATTN: Feature planned - User settings
    newBuildActions 
} from './inquirer/actions.mjs'
import { navHandler } from './navigation/nav.mjs'

inquirer.prompt(p.mainMenuPrompt).then(answers => {

    if (answers.main_menu === choices.createNew) {
        // nav(newFileFolderCommands)
        navHandler('nav', newFileFolderCommands)

    } else if (answers.main_menu === choices.build) {
        newBuildActions()
    } else if (answers.main_menu === choices.copyFrom) {
        // libraryNavHandler(defaultCommands)
        navHandler('library', defaultCommands)
    } else if (answers.main_menu === choices.settings) {
        // settingsActions()
        console.log('Settings coming soon!')
    } else if (answers.main_menu === choices.explore) {
        // nav(standardNavCommands)
        navHandler('nav', standardNavCommands)

    } else if (answers.main_menu === choices.help) {
        console.log('Help docs coming soon!')
    }

}).catch(error => {
    console.error('Error occurred:', error)
})
