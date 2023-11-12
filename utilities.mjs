import { promises, stat } from 'fs'
import util from 'util'
import inquirer from 'inquirer'
import { styled } from './styles.mjs'

const statPromise = util.promisify(stat)

function colorizeString(input, isDirectory) {
    return isDirectory ? styled(styled(`${input}`, 'bold'), 'cyan') : styled(input, 'green')
}

const allCommands = ['Back', 'Cancel', 'Place Here']
export async function gatherDynamicFolderContents(inputDirectory, commandOptions = allCommands) {
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
