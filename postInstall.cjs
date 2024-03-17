const { writeFile } = require('fs/promises')


const rootDir = __dirname
const rootDirArray = rootDir.split('\\')
const arrayOutput = []
rootDirArray.forEach(entry => {
    arrayOutput.push(`'${entry}'`)
})
const outputToFile = `export const relativeDirectoryArray = [${arrayOutput}]`
console.log(outputToFile)

writeFile(`${rootDir}/src/config/relativeDirectory.mjs`, outputToFile, (err) => {
    if (err) {
        console.error(`Error writing to file:`, err)
    } else {
        console.log(`File content changed successfully!`)
    }
})
