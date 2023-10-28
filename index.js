#! /usr/bin/env node
const { program } = require('commander')
const inquirer = require('inquirer')
const fs = require('fs')

// program
//     .version('1.0.0')
//     .description('A simple CLI for npm')
//     .option('-g, --greet <name>', 'Greet someone')
//     .option('-n, --name <name>', 'Your name')
//     .option('-f, --force', 'Force is active')
//     .parse(process.argv)

// async function promptUser() {
//     if (program.force) {
//         console.log('Force is enabled')
//     }

//     // if (program.greet) {
//     //     console.log(`Hello, ${name}!`)
//     // } else {
//     //     console.log('Hello, World!')
//     // }

//     if (!program.name) {
//         const answers = await inquirer.prompt([
//           {
//             type: 'input',
//             name: 'name',
//             message: 'What is your name?'
//           }
//         ])
//         program.name = answers.name
//       }

//       console.log(`Hello, ${program.name}!`)
// }

// promptUser()


const relativeDirectory = `c:/Users/rideo/Dropbox/Code/projects/cli/initial-test`
const componentDirectory = `${relativeDirectory}/library/components`

// Function to generate dynamic choices from files in a directory
async function gatherDynamicFolderContents(inputDirectory) {
    try {
        const files = await fs.promises.readdir(inputDirectory)
        return ['Back', 'Cancel', 'Place Here', ...files]
    } catch (error) {
        console.error('Error reading directory:', error)
        return []
    }
}



const questions = [{
    type: 'list',
    name: 'create_pick',
    message: 'Create or Pick a file?',
    choices: ['Create New', 'Pick Existing', 'Navigate From /src/']
}]

const srcDirPrompt = [{
    type: 'list',
    name: 'src_directory',
    message: 'In the /src directory?',
    choices: ['Yes', 'No']
}]

const whatDirPrompt = [{
    type: 'input',
    name: 'what_dir',
    message: 'Where then?',
}]

const whatFilenamePrompt = [{
    type: 'input',
    name: 'what_filename',
    message: 'What is the file to be called?'
}]

const renameFilePrompt = [{
    type: 'list',
    name: 'rename',
    message: 'Rename the component?',
    choices: ['Yes', 'No']
}]

const whatComponentNamePrompt = [{
    type: 'input',
    name: 'what_compname',
    message: 'What is the component to be called?'
}]

const selectFilePrompt = [{
    type: 'list',
    name: 'selectedFile',
    message: 'Select a file from the directory:',
    choices: () => gatherDynamicFolderContents(componentDirectory)
}]

const rootFolderPrompt = [{
    type: 'list',
    name: 'root_contents',
    message: 'Navigation',
    choices: () => gatherDynamicFolderContents(relativeDirectory)
}]


// const Prompt = [{
//     type: 'list',
//     name: '',
//     message: '',
//     choices:
// }]


// const Prompt = [{
//     type: 'list',
//     name: '',
//     message: '',
//     choices:
// }]


// const Prompt = [{
//     type: 'list',
//     name: '',
//     message: '',
//     choices:
// }]


// const Prompt = [{
//     type: 'list',
//     name: '',
//     message: '',
//     choices:
// }]

let pathArray = [relativeDirectory]

function nav(newContent, compName) {
    // console.log(newContent)
    const dynamicFolderPrompt = [{
        type: 'list',
        name: 'root_contents',
        message: 'Navigation',
        choices: () => gatherDynamicFolderContents(pathArray.join('/'))
    }]

    inquirer.prompt(dynamicFolderPrompt).then((answers) => {
        if (answers.root_contents === 'Back') {
            pathArray = pathArray.slice(0, -1)
            nav()
        } else if (answers.root_contents === 'Cancel') {
            console.log('Goodbye!')
        } else if (answers.root_contents === 'Place Here') {
            fs.writeFile(`${pathArray.join('/')}/${compName}.js`, newContent, (err) => { // TODO: capture file type
                if (err) {
                    console.error('Error writing to file:', err)
                } else {
                    console.log('File content changed successfully.')
                }
            })
        } else {
            fs.stat(pathArray.join('/'), (err, stats) => {
                if (err) {
                    console.error('Error getting file/folder information:', err)
                } else {
                    if (stats.isFile()) {
                        pathArray.push(answers.root_contents)
                        nav(newContent, compName)
                    } else if (stats.isDirectory()) {
                        pathArray.push(answers.root_contents)
                        nav(newContent, compName)
                    } else {
                        console.log('The selection is neither a file nor a folder.')
                    }
                }
            })
        }
    })
}



inquirer.prompt(questions).then(answers => {

    if (answers.create_pick === 'Create New') {
        inquirer.prompt(srcDirPrompt).then(answers => {
            if (answers.src_directory === 'Yes') {
                inquirer.prompt(whatFilenamePrompt).then(answers => {
                    fs.writeFile(`${relativeDirectory}/${answers.what_filename}.txt`, 'Hello, World!', (err) => {
                        if (err) {
                            console.error('Error creating the file:', err)
                        } else {
                            console.log('File created successfully!')
                        }
                    })
                }).catch(error => {
                    console.error('Error occurred:', error)
                })
            } else {
                inquirer.prompt(whatDirPrompt).then(answers => {
                    const what_dir = answers.what_dir
                    inquirer.prompt(whatFilenamePrompt).then(answers => {
                        fs.mkdir(`${relativeDirectory}/${what_dir}`, { recursive: true }, (err) => {
                            if (err) {
                                console.error('Error creating directory:', err)
                            } else {
                                console.log('Directory created successfully!')
                                fs.writeFile(`${relativeDirectory}/${what_dir}/${answers.what_filename}`, `console.log('Hello, World!')`, (err) => {
                                    if (err) {
                                        console.error('Error creating the file:', err)
                                    } else {
                                        console.log('File created successfully!')
                                    }
                                })
                            }
                        })
                    })
                }).catch(error => {
                    console.error('Error occurred in what_dir block:', error)
                })
            }
        })
    } else if (answers.create_pick === 'Pick Existing') {
        inquirer.prompt(selectFilePrompt).then(answers => {
            const selectedFilePath = `${componentDirectory}/${answers.selectedFile}`
            try {
                const data = fs.readFileSync(selectedFilePath, 'utf8')
                inquirer.prompt(renameFilePrompt).then(answers => {
                    if (answers.rename === 'Yes') {
                        inquirer.prompt(whatComponentNamePrompt).then(answers => {
                            const newContent = data.replace(/!!NAME!!/g, answers.what_compname).toString()
                            // fs.writeFile(selectedFilePath, newContent, (err) => {
                            //     if (err) {
                            //         console.error('Error writing to file:', err)
                            //     } else {
                            //         console.log('File content changed successfully.')
                            //     }
                            // })
                            nav(newContent, answers.what_compname)
                        })
                    } else if (answers.rename === 'No') { // TODO: Don't know if this is relevant - should there be a default option and how?
                        inquirer.prompt(whatComponentNamePrompt).then(answers => {
                            const newContent = data.replace(/!!NAME!!/g, answers.what_compname)
                            // fs.writeFile(selectedFilePath, newContent, (err) => {
                            //     if (err) {
                            //         console.error('Error writing to file:', err)
                            //     } else {
                            //         console.log('File content changed successfully.')
                            //     }
                            // })
                            nav(newContent, answers.what_compname)
                        })
                    }
                })
            } catch (err) {
                console.error('Error reading file:', err)
            }
        })
    } else if (answers.create_pick === 'Navigate From /src/') {
        nav()
    }
}).catch(error => {
    console.error('Error occurred:', error)
})