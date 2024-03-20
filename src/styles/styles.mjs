export function styled(input, style) {
    const matchingStyle = ANSIColors[style]
    const closeTag = '\x1b[0m'

    if (matchingStyle) {
        return `${matchingStyle}${input}${closeTag}`
    } else {
        return input
    }
}

export function clearANSI(input) {
    console.log('ansi', input)
    const ansiRegex = /\x1b\[[0-9;]*m/g
    return input.replace(ansiRegex, '')
}

const ANSIColors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m',
    italics: '\x1b[3m',
}
