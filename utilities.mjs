import { promises, stat } from 'fs'
import util from 'util'
import inquirer from 'inquirer'
import { clearANSI, styled } from './styles.mjs'
import { writeFile, cp } from 'fs'
import { directoriesContainingStyleSheets, directoriesWithNoExport } from './config.mjs'

const statPromise = util.promisify(stat)

export function colorizeString(input, isDirectory) {
    return isDirectory ? styled(styled(`${input}`, 'bold'), 'cyan') : styled(input, 'green')
}

export function answerMatch(answer, command) {
    return clearANSI(answer) === command
}

export const styledComponentRegex = new RegExp(`(^|[/\\\\])(${directoriesContainingStyleSheets.join('|')})([/\\\\]|$)`)

export const noExportRegExp = new RegExp(`(^|[/\\\\])(${directoriesWithNoExport.join('|')})([/\\\\]|$)`)

export async function gatherDynamicFolderContents(inputDirectory, commandOptions) {
    
    try {
        const styledCommands = commandOptions.map(entry => (
            styled(styled(entry, 'italics'), 'yellow')
        ))

        const files = await promises.readdir(inputDirectory)
        const taggedFiles = await Promise.all(
            files.map(async (entry) => {
                const stats = await statPromise(`${inputDirectory}/${entry}`)
                const isDirectory = stats.isDirectory()
                return colorizeString(entry, isDirectory)
            })
        )

        return [
            new inquirer.Separator(),
            ...styledCommands,
            new inquirer.Separator(),
            ...taggedFiles
        ]

    } catch (error) {
        console.error('Error reading directory:', error)
        return []
    }
}

export function fsWriteFile(path, newContent) {
    writeFile(path, newContent, (err) => {
        if (err) {
            console.error(`Error writing to file: ${path}`, err)
        } else {
            console.log(`${styled(styled(`File content changed successfully!`, 'green'), 'italics')}\n${path}`)
        }
    })
}

export function writeNewBundle(pathArray, options) {
    cp(source, pathArray.join('/'), { recursive: true }, (err) => {
        if (err) {
          console.error(err);
        }
      })
}

export function updatePrimaryStyleSheet(primaryStyleSheet, componentFilename, componentType) {
    const replaceTag = `/* HAL ${componentType.toUpperCase()} STYLESHEET TAG */`
    const newStyleImport = `@import "./${componentType}/${componentFilename.split('.')[0]}";`
    const newImportAndTag = `${newStyleImport}\n${replaceTag}`
    const regexPattern = new RegExp(`\\/\\*\\s*HAL ${componentType.toUpperCase()} STYLESHEET TAG\\s*\\*\\/`);
    return primaryStyleSheet.replace(regexPattern, newImportAndTag)
}
