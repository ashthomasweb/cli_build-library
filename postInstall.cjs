// import { fsWriteFile } from "./src/services/utilities.mjs"
const { writeFile } = require('fs/promises')


const rootDir = __dirname
console.log(rootDir)
const rootDirArray = rootDir.split('\\')
console.log(rootDirArray)
const arrayOutput = []
rootDirArray.forEach(entry => {
    arrayOutput.push(`'${entry}'`)
})
console.log(arrayOutput)
const outputToFile = `export const relativeDirectoryArray = [${arrayOutput}]`
console.log(outputToFile)

writeFile(`${rootDir}/src/config/relativeDirectory.mjs`, outputToFile, (err) => {
    if (err) {
        console.error(`Error writing to file:`, err)
    } else {
        console.log(`File content changed successfully!`)
    }
})
