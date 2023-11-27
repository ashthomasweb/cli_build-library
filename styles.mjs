export function styled(input, style) {
    const matchingStyle = ANSICodes.find(code => code.name === style)
    const closeTag = '\x1b[0m'

    if (matchingStyle) {
        return `${matchingStyle.code}${input}${closeTag}`
    } else {
        return input
    }
}

export function clearANSI(input) {
    const ansiRegex = /\x1b\[[0-9;]*m/g
    return input.replace(ansiRegex, '')
}

export const ANSICodes = [
    {
        name: 'red',
        code: '\x1b[31m',
    },
    {
        name: 'green',
        code: '\x1b[32m',
    },
    {
        name: 'blue',
        code: '\x1b[34m',
    },
    {
        name: 'yellow',
        code: '\x1b[33m',
    },
    {
        name: 'cyan',
        code: '\x1b[36m',
    },
    {
        name: 'bold',
        code: '\x1b[1m',
    },
    {
        name: 'italics',
        code: '\x1b[3m',
    },
    {
        name: 'close',
        code: '\x1b[0m'
    }
]
