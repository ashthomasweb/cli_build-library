import {
    relativeDirectoryArray,
    libraryStyleDirectory,
    componentDirectory,
    defaultCommands,
    fromLibraryCommands,
    directoriesContainingStyleSheets,
    projectComponentStylesFolder,
    projectMainStylesheet,
    placeComponentCommands,
    navCommandObject as cmd
} from "./config.mjs" // COULD BE BROUGHT IN CLEANER AFTER CONFIG IS FULLY OPERATIONAL
import inquirer from "inquirer"
import * as p from './prompts.js'
import { clearANSI } from './styles.mjs'
import { stat, readFileSync, promises } from 'fs'
import { setSourceAction, newFileAction, newFolderAction, newBuildAtLocation } from "./inquirerActions.mjs"
import { answerMatch, styledComponentRegex, noExportRegExp, updatePrimaryStyleSheet, fsWriteFile } from "./utilities.mjs"

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

function handleNamingUpdatingAndNav(primaryStyleSheetInitContent = null) {
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

    inquirer.prompt(p.generateDynamicPrompt(commandArray)).then((answers) => {
        if (answerMatch(answers.contents, cmd.back)) {
            pathArray = pathArray.slice(0, -1)
            nav(commandArray)
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
            // setTimeout(() => { // NOT WORKING HACK TO ENABLE CONTINUOUS NAV OPERATIONS
            //     libraryNav()
            // }, 1500)
        } else if (answerMatch(answers.contents, cmd.setSRC)) {
            setSourceAction()
        } else if (answerMatch(answers.contents, cmd.newFile)) {
            newFileAction(pathArray)
        } else if (answerMatch(answers.contents, cmd.newFolder)) {
            newFolderAction(pathArray)
        } else if (answerMatch(answers.contents, cmd.startBuild)) {
            newBuildAtLocation(pathArray, options)
        } else {
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

const libraryPath = componentDirectory // THIS IS WHERE THE ISSUE LIES FOR CONTINUOUS NAV OPERATIONS

export function libraryNav(commandArray = defaultCommands) {
    inquirer.prompt(p.generateDynamicLibraryPrompt(fromLibraryCommands)).then(answers => {
        stat(`${libraryPath.join('/')}/${clearANSI(answers.selection)}`, (err, stats) => {
            if (err) {
                console.error('Error getting file/folder information:', err)
            } else {
                if (stats.isFile()) { // HANDLES FILE SELECTION
                    libraryPath.push(clearANSI(answers.selection))
                    libraryPath.join('/').match(noExportRegExp) === null && (hasExport = true)

                    if (libraryPath.join('/').match(styledComponentRegex)) {
                        /* --------------- HAS STYLESHEET COMPONENTS ---------------- */
                        hasStylesheet = true

                        async function getStyleSheets() {
                            const styleFiles = await promises.readdir(libraryStyleDirectory.join('/'))
                            return styleFiles
                        }
                        getStyleSheets().then(result => {
                            const relativeStyleSheetFilename = result.filter(entry => entry.includes(clearANSI(answers.selection.split('.')[0])))[0]
                            tempStylesheetContent = readFileSync(`${libraryStyleDirectory.join('/')}/${relativeStyleSheetFilename}`, 'utf8')
                            const primaryStyleSheetInitContent = readFileSync(`${projectMainStylesheet.join('/')}`).toString()
                            handleNamingUpdatingAndNav(primaryStyleSheetInitContent)
                        })

                    } else {
                        /* --------------- NO STYLESHEET COMPONENTS ---------------- */
                        handleNamingUpdatingAndNav()
                    }

                } else if (stats.isDirectory()) { // HANDLES DIRECTORY SELECTION
                    if (directoriesContainingStyleSheets.includes(clearANSI(answers.selection))) {
                        tempStyledComponentType = clearANSI(answers.selection)
                    }
                    libraryPath.push(clearANSI(answers.selection))
                    libraryNav(commandArray)
                } else {
                    console.log('The selection is neither a file nor a folder.')
                }
            }
        })

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
