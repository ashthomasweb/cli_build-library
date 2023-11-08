import { promises, writeFile, stat, mkdir, readFileSync } from 'fs'

export async function gatherDynamicFolderContents(inputDirectory) {
    try {
        const files = await promises.readdir(inputDirectory)
        await files.forEach((entry, index) => {
            if (entry.includes('.')) {
                files[index] = styled(styled(entry, 'bold'), 'yellow')
            } else {
                files[index] = styled(entry, 'italics')
            }
        })
        // await console.log(formattedFiles)
        return ['Back', 'Cancel', '\x1b[31mPlace Here\x1b[0m', ...files]
    } catch (error) {
        console.error('Error reading directory:', error)
        return []
    }
}

export function styled(input, style) {
    const closeTag = '\x1b[0m'
    switch (style) {
        case 'red':
            return `\x1b[31m${input}${closeTag}`
            break;

        case 'green':
            return `\x1b[32m${input}${closeTag}`
            break;

        case 'blue':
            return `\x1b[34m${input}${closeTag}`
            break;

        case 'yellow':
            return `\x1b[33m${input}${closeTag}`
            break;

        case 'bold':
            return `\x1b[1m${input}${closeTag}`
            break;

        case 'italics':
            return `\x1b[3m${input}${closeTag}`
            break;

        default:
            break;
    }
}