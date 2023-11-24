import {
    newFileFolderCommands,
    relativeDirectoryArray,
    libraryStyleDirectory,
    componentDirectory,
    defaultCommands,
    fromLibraryCommands,
    directoriesContainingStyleSheets
} from "./config.mjs"
import inquirer from "inquirer"
import * as p from './prompts.js'
import { clearANSI } from './styles.mjs'
import { stat, readFileSync, mkdir, writeFile, promises } from 'fs'
import { fsWriteFile, gatherDynamicFolderContents } from "./utilities.mjs"
import { setSourceAction, newFileAction, newFolderAction } from "./inquirerActions.mjs"
import { navCommandObject as cmd } from "./config.mjs"
import { answerMatch, statPromise, colorizeString } from "./utilities.mjs"

var tempFileContent = null
var tempFileName = null
var tempFilePath = null
export var pathArray = relativeDirectoryArray

export function nav(commandArray = defaultCommands) {

    inquirer.prompt(p.generateDynamicPrompt(commandArray)).then((answers) => {
        if (answerMatch(answers.contents, cmd.back)) {
            pathArray = pathArray.slice(0, -1)
            nav(commandArray)
        } else if (answerMatch(answers.contents, cmd.cancel)) {
            console.log('Goodbye!')
        } else if (answerMatch(answers.contents, cmd.place)) {
            // check for sass match
            // if sass match -
            // create folder
            // find sass
            // copy sass
            // write new files in folder
            fsWriteFile(`${pathArray.join('/')}/${tempFileName}`, tempFileContent) // write component file
            tempFileContent = null
            tempFileName = null
            tempFilePath = null
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

                        // if (pathArray[pathArray.length - 1] === 'components') {
                        //     console.log('test')
                        // } else {

                        // }
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
                    console.log('isFile')
                    libraryPath.push(clearANSI(answers.selection))
                    var regexPattern = '(^|[/\\\\])(' + directoriesContainingStyleSheets.join('|') + ')([/\\\\]|$)';
                    const styledComponentRegex = new RegExp(regexPattern)

                    if (libraryPath.join('/').match(styledComponentRegex)) {
                        console.log('test')
                        async function getStyleSheets() {
                            const styleFiles = await promises.readdir(libraryStyleDirectory.join('/'))
                            return styleFiles
                        }
                        getStyleSheets().then(result => {
                            const styleFiles = result
                            const selectedFile = answers.selection
                            const selectedFileName = clearANSI(selectedFile.split('.')[0])
                            const relativeStyleSheet = styleFiles.filter(entry => entry.includes(selectedFileName))[0]
                            const relativeStylePath = libraryStyleDirectory.join('/') + '/' + relativeStyleSheet
                            console.log(relativeStylePath)
                            const componentPath = libraryPath
                            console.log(componentPath.join('/'))
                            // try {
                            //     const data = readFileSync(libraryPath.join('/'), 'utf8')
                            //     inquirer.prompt(p.whatFilenamePrompt).then(answers => {
                            //         tempFileName = answers.what_filename
                            //         inquirer.prompt(p.whatComponentNamePrompt).then(answers => {
                            //             tempFileContent = data.replace(/!!NAME!!/g, answers.what_compname).toString()
                            //             nav(defaultCommands)
                            //         })
                            //     })
                            // } catch (err) {
                            //     console.error('Error reading file:', err)
                            // }


                        })
                        
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
