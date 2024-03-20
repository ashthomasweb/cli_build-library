/* Configuration imports */
import {
    defaultCommands,
    fromLibraryCommands,
    directoriesContainingStyleSheets,
    placeComponentCommands,
    navCommandObject as cmd,
    newBuildPlacement
} from "../config/config.mjs"

import {
    libraryStyleDirectory,
    componentDirectory,
    bundlesDirectory,
    projectComponentStylesFolder,
    projectMainStylesheet,
} from "../config/pathVariables.mjs"

import { relativeDirectoryArray } from "../config/relativeDirectory.mjs"

/* Library and Helper imports */
import inquirer from "inquirer"
import * as p from '../inquirer/prompts.js'
import {
    // setSourceAction, // ATTN: Planned feature - User Settings
    newFileAction,
    newFolderAction,
    newBuildActions
} from "../inquirer/actions.mjs"

import { stat, readFileSync, promises } from 'fs'

import {
    answerMatch,
    styledComponentRegex,
    noExportRegExp,
    updatePrimaryStyleSheet,
    fsWriteFile,
    writeNewBundle
} from "../services/utilities.mjs"

import { clearANSI } from '../styles/styles.mjs'
import { trace } from "console"

/* Local variable used to store temporary values */
var tempComponentFilename = null
var tempComponentContent = null
var tempStylesheetContent = null
var tempPrimaryStylesheetContent = null
var tempStyledComponentType = null
var tempComponentName = null
var hasExport = false
var hasStylesheet = false

function garbageCollectTempVars() {
    tempComponentFilename = null
    tempComponentContent = null
    tempStylesheetContent = null
    tempPrimaryStylesheetContent = null
    tempStyledComponentType = null
    tempComponentName = null
    hasExport = false
    hasStylesheet = false
}

function updateStyleAction(answers, libraryPath) {
    libraryPath.push(clearANSI(answers.contents))
    libraryPath.join('/').match(noExportRegExp) === null && (hasExport = true)

    if (libraryPath.join('/').match(styledComponentRegex)) { /* --------------- HAS STYLESHEET COMPONENTS ---------------- */
        hasStylesheet = true

        async function getStyleSheets() {
            const styleFiles = await promises.readdir(libraryStyleDirectory.join('/'))
            return styleFiles
        }
        getStyleSheets().then(result => {
            const relativeStyleSheetFilename = result.filter(entry => entry.includes(clearANSI(answers.contents.split('.')[0])))[0]
            tempStylesheetContent = readFileSync(`${libraryStyleDirectory.join('/')}/${relativeStyleSheetFilename}`, 'utf8')
            const primaryStyleSheetInitContent = readFileSync(`${projectMainStylesheet.join('/')}`).toString()
            handleNamingUpdatingAndNav(libraryPath, primaryStyleSheetInitContent)
        })

    } else { /* --------------- NO STYLESHEET COMPONENTS ---------------- */
        handleNamingUpdatingAndNav(libraryPath)
    }
}

function handleNamingUpdatingAndNav(libraryPath, primaryStyleSheetInitContent = null) {
    try {
        inquirer.prompt(p.whatFilenamePrompt).then(answers => {
            tempComponentFilename = answers.what_filename
            hasStylesheet && (tempPrimaryStylesheetContent = updatePrimaryStyleSheet(primaryStyleSheetInitContent, tempComponentFilename, tempStyledComponentType))

            if (hasExport) {
                inquirer.prompt(p.whatComponentNamePrompt).then(answers => {
                    tempComponentName = answers.what_compname
                    tempComponentContent = readFileSync(libraryPath.join('/'), 'utf8')
                    hasExport && (tempComponentContent = tempComponentContent.replace(/!!NAME!!/g, tempComponentName).toString())
                }).finally(() => {
                    nav(placeComponentCommands)
                })
            } else if (!hasExport) {
                tempComponentContent = readFileSync(libraryPath.join('/'), 'utf8')
                nav(placeComponentCommands)
            }

        })
    } catch (err) {
        console.error('Error reading file:', err)
    }
}

export var pathArray = relativeDirectoryArray

export function nav(commandArray = defaultCommands, options = null) {
    console.log('TRACE: nav')
    inquirer.prompt(p.generateDynamicPrompt(commandArray, pathArray)).then((answers) => {
        if (answerMatch(answers.contents, cmd.up)) {
            pathArray = pathArray.slice(0, -1)
            nav(commandArray, options)
        } else if (answerMatch(answers.contents, cmd.cancel)) {
            console.log('Goodbye!')
        } else if (answerMatch(answers.contents, cmd.place)) {
            try {
                fsWriteFile(`${pathArray.join('/')}/${tempComponentFilename}`, tempComponentContent) // Write new component
                if (tempStylesheetContent !== null) {
                    fsWriteFile(`${projectComponentStylesFolder.join('/')}/${tempStyledComponentType}/${tempComponentFilename.split('.')[0]}.scss`, tempStylesheetContent) // Write new scss file
                    fsWriteFile(`${projectMainStylesheet.join('/')}`, tempPrimaryStylesheetContent) // Write updated primary stylesheet
                }
            } catch (error) {
                console.log('Something went wrong!', error)
            } finally {
                garbageCollectTempVars()
            }
            // } else if (answerMatch(answers.contents, cmd.setSRC)) { // ATTN: Planned feature - User Settings
            //     setSourceAction()
        } else if (answerMatch(answers.contents, cmd.newFile)) {
            newFileAction(pathArray)
        } else if (answerMatch(answers.contents, cmd.newFolder)) {
            newFolderAction(pathArray)
        } else if (answerMatch(answers.contents, cmd.startBuild)) {
            writeNewBundle(pathArray, options)
        } else {
            console.log('TRACE: file/folder')
            stat(`${pathArray.join('/')}/${clearANSI(answers.contents)}`, (err, stats) => {
                if (err) {
                    console.error('Error getting file/folder information:', err)
                } else {
                    if (stats.isFile()) {
                        console.log('No action available') // THIS IS A USELESS ENDPOINT FOR THE USER
                    } else if (stats.isDirectory()) {
                        pathArray.push(clearANSI(answers.contents))
                        nav(commandArray, options)
                    } else {
                        console.log('The selection is neither a file nor a folder.')
                    }
                }
            })
        }
    })
}

/*
Each of the nav functions has it's own path array. This array gets modified and passed into the dynamic
prompt function whenever a new folder is selected. The below path reference to the imported - in this 
example - 'componentDirectory' doesn't have it's own reference value - the dynamic prompt is also reading 
this 'componentDirectory' each time the function is run through during standard navigation.

Each time the package is run from the initial cli menu the 'componentDirectory' starts fresh from the 
initially defined path.

This issue is identical in all three nav operations, 'nav' - 'libraryNav' - 'bundleNav'

Could potentially be solved by spreading the 'componentDirectory', creating a new reference, and passing
that new reference into the dynamicPrompt function as an option. This could eliminate the three separate 
dynamicPrompt functions, turning them into one handler function with options.

*/

export const libraryNavHandler = (commandArray = defaultCommands) => {

    let libraryPath = [...componentDirectory] // THIS IS WHERE THE ISSUE LIES FOR CONTINUOUS NAV OPERATIONS .. fix in progress

    function libraryNav(commandArray) {
        console.log('TRACE: libraryNav')
        inquirer.prompt(p.generateDynamicPrompt(fromLibraryCommands, libraryPath)).then(answers => {
            if (answerMatch(answers.contents, cmd.cancel)) {
                console.log('Goodbye!')
            } else if (answerMatch(answers.contents, cmd.up)) {
                libraryPath = libraryPath.slice(0, -1)
                libraryNav(commandArray)
            } else {
                stat(`${libraryPath.join('/')}/${clearANSI(answers.contents)}`, (err, stats) => {
                    if (err) {
                        console.error('Error getting file/folder information:', err)
                    } else {
                        if (stats.isFile()) { // HANDLES FILE SELECTION
                            updateStyleAction(answers, libraryPath)
                        } else if (stats.isDirectory()) { // HANDLES DIRECTORY SELECTION
                            if (directoriesContainingStyleSheets.includes(clearANSI(answers.contents))) {
                                tempStyledComponentType = clearANSI(answers.contents)
                            }
                            libraryPath.push(clearANSI(answers.contents))
                            libraryNav(commandArray)
                        } else {
                            console.log('The selection is neither a file nor a folder.')
                        }
                    }
                })
            }
        })
    }
    libraryNav(commandArray)
}

// const bundlePath = bundlesDirectory

export function bundleNav(commandArray = defaultCommands, bundlePath) {
    console.log('TRACE: bundleNav', bundlePath)
    inquirer.prompt(p.generateDynamicPrompt(commandArray, bundlePath)).then(answers => {
        if (answerMatch(answers.contents, cmd.reset)) {
            newBuildActions()
        } else if (answerMatch(answers.contents, cmd.cancel)) {
            console.log('Goodbye!')
        } else {
            console.log('TRACE: file/folder from bundleNav')
            stat(`${bundlePath.join('/')}/${clearANSI(answers.contents)}`, (err, stats) => {
                if (err) {
                    console.error('Error getting file/folder information:', err)
                } else {
                    const options = {
                        bundlePath: bundlePath,
                        // langBundleSelection: bundlePath,
                        bundleSelection: answers.contents
                    }
                    nav(newBuildPlacement, options)
                }
            })
        }
    })
}

/* DEV FUNCTIONS */

// function logTempVars() {
//     console.log('comp filename', tempComponentFilename)
//     console.log('comp content', tempComponentContent)
//     console.log('comp export name', tempComponentName)
//     console.log('stylesheet content', tempStylesheetContent)
//     console.log('primary stylesheet content', tempPrimaryStylesheetContent)
//     console.log('comp type', tempStyledComponentType)
// }
