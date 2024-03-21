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

export function navHandler(type, commands, options) {
    let path
    if (type === 'nav') (path = [...relativeDirectoryArray])
    if (type === 'library') (path = [...componentDirectory])
    if (type === 'bundle') (path = [...options.bundlePath])

    // nav logic

    console.log('TRACE: navHandler', '\n', 'path: ', path, '\n', 'type: ', type, '\n', 'options: ', options)
    // in the 'else' block for the 'stat' {
        type === 'nav' && navStat()
        type === 'library' && libraryStat()
        type === 'bundle' && bundleStat()
    // }
}

function navStat(pathArray, answers, commandArray, options = null) {
    console.log('TRACE: navStat')
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

function libraryStat() {
    console.log('TRACE: libraryStat')
}

function bundleStat() {
    console.log('TRACE: bundleStat')
}

function placeComponentAction(pathArray) {
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
}

export var pathArray = relativeDirectoryArray // TODO: no longer need to be exported

export function nav(commandArray = defaultCommands, options = null) {
    inquirer.prompt(p.generateDynamicPrompt(commandArray, pathArray)).then((answers) => {
        if (answerMatch(answers.contents, cmd.up)) {
            pathArray = pathArray.slice(0, -1)
            nav(commandArray, options)
        } else if (answerMatch(answers.contents, cmd.cancel)) {
            console.log('Goodbye!')
        } else if (answerMatch(answers.contents, cmd.place)) {
            placeComponentAction(pathArray)
        } else if (answerMatch(answers.contents, cmd.newFile)) {
            newFileAction(pathArray)
        } else if (answerMatch(answers.contents, cmd.newFolder)) {
            newFolderAction(pathArray)
        } else if (answerMatch(answers.contents, cmd.startBuild)) {
            writeNewBundle(pathArray, options)
        // } else if (answerMatch(answers.contents, cmd.setSRC)) { // ATTN: Planned feature - User Settings
            //     setSourceAction()
        } else {
            navStat(pathArray, answers, commandArray, options)
        }
    })
}

export const libraryNavHandler = (commandArray = defaultCommands) => {

    let libraryPath = [...componentDirectory]

    function libraryNav(commandArray) {
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


export function bundleNav(commandArray = defaultCommands, bundlePath) {
    inquirer.prompt(p.generateDynamicPrompt(commandArray, bundlePath)).then(answers => {
        if (answerMatch(answers.contents, cmd.reset)) {
            newBuildActions()
        } else if (answerMatch(answers.contents, cmd.cancel)) {
            console.log('Goodbye!')
        } else {
            stat(`${bundlePath.join('/')}/${clearANSI(answers.contents)}`, (err, stats) => {
                if (err) {
                    console.error('Error getting file/folder information:', err)
                } else {
                    const options = {
                        bundlePath: bundlePath,
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
