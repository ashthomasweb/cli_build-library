#! /usr/bin/env node

/* Configuration imports */
import { 
    defaultCommands, 
    mainMenuChoices as choices, 
    newFileFolderCommands, 
    standardNavCommands 
} from './config/config.mjs'

import { projectDirectory } from './config/projectDirectory.mjs'

/* Library and Helper imports */
import inquirer from 'inquirer'
import * as p from './inquirer/prompts.js'
import { 
    settingsActions,
    newBuildActions 
} from './inquirer/actions.mjs'

import { navHandler } from './navigation/nav.mjs'

import { styled } from './styles/styles.mjs'
import { projectMainStylesheet } from './config/projectMainStylesheet.mjs'
import { projectStylesFolder } from './config/projectStylesFolder.mjs'

inquirer.prompt(p.mainMenuPrompt).then(answers => {

    if (answers.main_menu === choices.createNew) { // TODO: implement answerMatch() - should work here but doesn't...
        navHandler('nav', newFileFolderCommands)
    } else if (answers.main_menu === choices.build) {
        newBuildActions()
    } else if (answers.main_menu === choices.copyFrom) {
        projectMainStylesheet.length === 1 && console.log(`\n${styled(styled('** ATTENTION - your project stylesheet directory is unset! **', 'yellow'), 'bold')}\n${styled('For your convienience, set a file under "User Settings".', 'bold')}\n`)
        projectStylesFolder.length === 1 && console.log(`\n${styled(styled('** ATTENTION - your project style folder is unset! **', 'yellow'), 'bold')}\n${styled('For your convienience, set a directory under "User Settings".', 'bold')}\n`)
        if (projectMainStylesheet.length !== 1 & projectStylesFolder.length !== 1) navHandler('library', defaultCommands)
    } else if (answers.main_menu === choices.settings) {
        settingsActions()
    } else if (answers.main_menu === choices.explore) {
        projectDirectory.length === 1 && console.log(`\n${styled(styled('** ATTENTION - your project directory is unset! **', 'yellow'), 'bold')}\n${styled('For your convienience, set a directory under "User Settings".', 'bold')}\n`)
        navHandler('nav', standardNavCommands)
    } else if (answers.main_menu === choices.help) {
        console.log('Help docs coming soon!')
    }

}).catch(error => {
    console.error('Error occurred:', error)
})
