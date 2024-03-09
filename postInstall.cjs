// import { fsWriteFile } from "./src/services/utilities.mjs"
const { writeFile } = require('fs/promises')

console.log('dirname: ', __dirname)

const rootDir = __dirname
const rootDirArray = rootDir.split(', ')
const outputToFile = `export const relativeDirectoryArray = [${rootDirArray}]`
console.log(outputToFile)

writeFile(`${rootDir}/src/config/relativeDirectory.mjs`, outputToFile, (err) => {
    if (err) {
        console.error(`Error writing to file:`, err)
    } else {
        console.log(`File content changed successfully!`)
    }
})

// fsWriteFile(`${rootDir}/src/config/relativeDirectory.mjs`, rootDir)
