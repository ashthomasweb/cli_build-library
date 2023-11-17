import { promises, stat } from 'fs'
import util from 'util'
import inquirer from 'inquirer'
import { styled } from './styles.mjs'
import { writeFile } from 'fs'

const statPromise = util.promisify(stat)

function colorizeString(input, isDirectory) {
    return isDirectory ? styled(styled(`${input}`, 'bold'), 'cyan') : styled(input, 'green')
}

export async function gatherDynamicFolderContents(inputDirectory, commandOptions) {
    try {
        const files = await promises.readdir(inputDirectory)
        const taggedFiles = await Promise.all(
            files.map(async (entry) => {
                const fullPath = `${inputDirectory}/${entry}`
                const stats = await statPromise(fullPath)
                const isDirectory = stats.isDirectory()
                const styledEntry = colorizeString(entry, isDirectory)
                return styledEntry
            })
        )

        const styledCommands = commandOptions.map(entry => (
            styled(styled(entry, 'italics'), 'yellow')
        ))

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
            console.error('Error writing to file:', err)
        } else {
            console.log('File content changed successfully.')
        }
    })
}