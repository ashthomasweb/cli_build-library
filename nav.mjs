import {
    newFileFolderCommands,
    relativeDirectoryArray,
    libraryStyleDirectory,
    componentDirectory,
    defaultCommands,
    fromLibraryCommands,
    directoriesContainingStyleSheets,
    projectComponentStylesFolder,
    projectMainStylesheet,
    placeComponentCommands,
    directoriesWithNoExport
} from "./config.mjs"
import inquirer from "inquirer"
import * as p from './prompts.js'
import { clearANSI } from './styles.mjs'
import { stat, readFileSync, mkdir, writeFile, promises } from 'fs'
import { fsWriteFile, gatherDynamicFolderContents } from "./utilities.mjs"
import { setSourceAction, newFileAction, newFolderAction } from "./inquirerActions.mjs"
import { navCommandObject as cmd } from "./config.mjs"
import { answerMatch, statPromise, colorizeString } from "./utilities.mjs"

var tempComponentName = null
var tempComponentContent = null
var tempStylesheetContent = null
var tempPrimaryStylesheetContent = null
var tempStyledComponentType = null

function garbageCollectTempVars() {
    tempComponentName = null
    tempComponentContent = null
    tempStylesheetContent = null
    tempPrimaryStylesheetContent = null
    tempStyledComponentType = null
}
export var pathArray = relativeDirectoryArray

export function nav(commandArray = defaultCommands) {

    inquirer.prompt(p.generateDynamicPrompt(commandArray)).then((answers) => {
        if (answerMatch(answers.contents, cmd.back)) {
            pathArray = pathArray.slice(0, -1)
            nav(commandArray)
        } else if (answerMatch(answers.contents, cmd.cancel)) {
            console.log('Goodbye!')
        } else if (answerMatch(answers.contents, cmd.place)) {
            try {
                fsWriteFile(`${pathArray.join('/')}/${tempComponentName}`, tempComponentContent)
                if (tempStylesheetContent !== null) {
                    fsWriteFile(`${projectComponentStylesFolder.join('/')}/${tempStyledComponentType}s/${tempComponentName.split('.')[0]}.scss`, tempStylesheetContent)
                    fsWriteFile(`${projectMainStylesheet.join('/')}`, tempPrimaryStylesheetContent)
                }
            } catch (error) {
                console.log('Something went wrong!', error)
                garbageCollectTempVars()
            }
            garbageCollectTempVars()
        } else if (answerMatch(answers.contents, cmd.setSRC)) {
            setSourceAction()
        } else if (answerMatch(answers.contents, cmd.newFile)) {
            newFileAction(pathArray)
        } else if (answerMatch(answers.contents, cmd.newFolder)) {
            newFolderAction(pathArray)
        } else {
            stat(`${pathArray.join('/')}/${clearANSI(answers.contents)}`, (err, stats) => {
                if (err) {
                    console.error('Error getting file/folder information:', err)
                } else {
                    if (stats.isFile()) {
                        console.log('No action available')
                    } else if (stats.isDirectory()) {
                        pathArray.push(clearANSI(answers.contents))
                        nav(commandArray)
                    } else {
                        console.log('The selection is neither a file nor a folder.')
                    }
                }
            })
        }
    })
}

const libraryPath = componentDirectory

export function libraryNav(commandArray = defaultCommands) {
    inquirer.prompt(p.generateDynamicLibraryPrompt(fromLibraryCommands)).then(answers => {
        stat(`${libraryPath.join('/')}/${clearANSI(answers.selection)}`, (err, stats) => {
            if (err) {
                console.error('Error getting file/folder information:', err)
            } else {
                if (stats.isFile()) {
                    libraryPath.push(clearANSI(answers.selection))
                    if (clearANSI(answers.selection).includes('component')) {
                        tempStyledComponentType = 'component'
                    } else if ((clearANSI(answers.selection).includes('view'))) {
                        tempStyledComponentType = 'view'
                    }
                    var regexPattern = '(^|[/\\\\])(' + directoriesContainingStyleSheets.join('|') + ')([/\\\\]|$)';
                    const styledComponentRegex = new RegExp(regexPattern)

                    if (libraryPath.join('/').match(styledComponentRegex)) {
                        async function getStyleSheets() {
                            const styleFiles = await promises.readdir(libraryStyleDirectory.join('/'))
                            return styleFiles
                        }
                        getStyleSheets().then(result => {
                            const selectedFileName = clearANSI(answers.selection.split('.')[0])
                            const relativeStyleSheet = result.filter(entry => entry.includes(selectedFileName))[0]
                            const primaryStyleSheet = readFileSync(`${projectMainStylesheet.join('/')}`).toString()
                            tempStylesheetContent = readFileSync(`${libraryStyleDirectory.join('/')}/${relativeStyleSheet}`, 'utf8')

                            // REFACTOR
                            let newStyleImport
                            function updatePrimaryStyleSheet(componentType) {
                                console.log(componentType)
                                const replaceTag = `/* HAL ${componentType.toUpperCase()}S STYLESHEET TAG */`
                                newStyleImport = `@import "./${componentType}s/${relativeStyleSheet.split('.')[0]}";`
                                const newStringBlock = `${newStyleImport}\n${replaceTag}`
                                const regexPattern = new RegExp(`\\/\\*\\s*HAL ${componentType.toUpperCase()}S STYLESHEET TAG\\s*\\*\\/`);

                                // const replaceTagRegex = `/\/\*\s*HAL ${componentType}S STYLESHEET TAG\s*\*\//`
                                // const tagRegex = new RegExp(replaceTagRegex)
                                tempPrimaryStylesheetContent = primaryStyleSheet.replace(regexPattern, newStringBlock)

                            }
                            updatePrimaryStyleSheet(tempStyledComponentType)
                            // if (tempStyledComponentType === 'component') {
                            //     // const replaceTag = `/* HAL COMPONENTS STYLESHEET TAG */`
                            //     // newStyleImport = `@import "./components/${relativeStyleSheet.split('.')[0]}";`
                            //     // const newStringBlock = `${newStyleImport}\n${replaceTag}`
                            //     tempPrimaryStylesheetContent = primaryStyleSheet.replace(/\/\*\s*HAL COMPONENTS STYLESHEET TAG\s*\*\//, newStringBlock)
                            // } else if (tempStyledComponentType === 'view') {
                            //     // const replaceTag = `/* HAL VIEWS STYLESHEET TAG */`
                            //     // newStyleImport = `@import "./views/${relativeStyleSheet.split('.')[0]}";`
                            //     // const newStringBlock = `${newStyleImport}\n${replaceTag}`
                            //     tempPrimaryStylesheetContent = primaryStyleSheet.replace(/\/\*\s*HAL VIEWS STYLESHEET TAG\s*\*\//, newStringBlock)
                            // }
                            // END REFACTOR

                            try {
                                inquirer.prompt(p.whatFilenamePrompt).then(answers => {
                                    tempComponentName = answers.what_filename
                                    inquirer.prompt(p.whatComponentNamePrompt).then(answers => {
                                        tempComponentContent = readFileSync(libraryPath.join('/'), 'utf8').replace(/!!NAME!!/g, answers.what_compname).toString()
                                        nav(placeComponentCommands)
                                    })
                                })
                            } catch (err) {
                                console.error('Error reading file:', err)
                            }

                        })

                    } else {
                        try {
                            inquirer.prompt(p.whatFilenamePrompt).then(answers => {
                                tempComponentName = answers.what_filename
                                var regexPattern = '(^|[/\\\\])(' + directoriesWithNoExport.join('|') + ')([/\\\\]|$)';
                                const noExportRegExp = new RegExp(regexPattern)

                                if (libraryPath.join('/').match(noExportRegExp) === null) {
                                    inquirer.prompt(p.whatComponentNamePrompt).then(answers => {
                                        tempComponentContent = readFileSync(libraryPath.join('/'), 'utf8').replace(/!!NAME!!/g, answers.what_compname).toString()
                                        nav(placeComponentCommands)
                                    })
                                } else {
                                    tempComponentContent = readFileSync(libraryPath.join('/'), 'utf8').toString()
                                    nav(placeComponentCommands)
                                }
                            })
                        } catch (err) {
                            console.error('Error reading file:', err)
                        }
                    }


                } else if (stats.isDirectory()) {
                    libraryPath.push(clearANSI(answers.selection))
                    libraryNav(commandArray)
                } else {
                    console.log('The selection is neither a file nor a folder.')
                }
            }
        })

    })
}
