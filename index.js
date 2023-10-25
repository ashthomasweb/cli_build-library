#! /usr/bin/env node
const { program } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');

program
    .version('1.0.0')
    .description('A simple CLI for npm')
    .option('-g, --greet <name>', 'Greet someone')
    .option('-n, --name <name>', 'Your name')
    .option('-f, --force', 'Force is active')
    .parse(process.argv);

// const name = 'Ash'

// async function promptUser() {
//     if (program.force) {
//         console.log('Force is enabled')
//     }

//     // if (program.greet) {
//     //     console.log(`Hello, ${name}!`);
//     // } else {
//     //     console.log('Hello, World!');
//     // }

//     if (!program.name) {
//         const answers = await inquirer.prompt([
//           {
//             type: 'input',
//             name: 'name',
//             message: 'What is your name?'
//           }
//         ]);
//         program.name = answers.name;
//       }

//       console.log(`Hello, ${program.name}!`);
// }

// promptUser()

const questions = [
    {
        type: 'list',
        name: 'create',
        message: 'Create a file?',
        choices: ['Yes', 'No']
    },
];

const srcDirPrompt = [{
    type: 'list',
    name: 'src_directory',
    message: 'In the /src directory?',
    choices: ['Yes', 'No']
}]


const whatDirPrompt = [
    {
        type: 'input',
        name: 'what_dir',
        message: 'Where then?',
    },
]

const whatFilenamePrompt = [
    {
        type: 'input',
        name: 'what_filename',
        message: 'What is the file to be called?'
    },
]

const pickFilePrompt = [
    {
        type: 'list',
        name: 'pickFile',
        message: 'Pick an existing file?',
        choices: ['Yes', 'No']
    },
]

const renameFilePrompt = [
    {
        type: 'list',
        name: 'rename',
        message: 'Rename the component?',
        choices: ['Yes', 'No']
    },
]

const whatComponentPrompt = [
    {
        type: 'input',
        name: 'what_compname',
        message: 'What is the component to be called?'
    },
]





const relativeDirectory = `c:/Users/rideo/Dropbox/Code/projects/cli/initial-test`
const componentDirectory = `${relativeDirectory}/library/components`


inquirer
    .prompt(questions)
    .then(answers => {
        if (answers.create === 'Yes') {

            inquirer
                .prompt(srcDirPrompt)
                .then(answers => {

                    if (answers.src_directory === 'Yes') {

                        inquirer
                            .prompt(whatFilenamePrompt)
                            .then(answers => {

                                fs.writeFile(`${relativeDirectory}/${answers.what_filename}.txt`, 'Hello, World!', (err) => {
                                    if (err) {
                                        console.error('Error creating the file:', err);
                                    } else {
                                        console.log('File created successfully!');
                                    }
                                });
                            })
                            .catch(error => {
                                console.error('Error occurred:', error);
                            });
                    } else {


                        inquirer
                            .prompt(whatDirPrompt)
                            .then(answers => {

                                const what_dir = answers.what_dir

                                inquirer.prompt(whatFilenamePrompt)
                                    .then(answers => {

                                        fs.mkdir(`${relativeDirectory}/${what_dir}`, { recursive: true }, (err) => {
                                            if (err) {
                                                console.error('Error creating directory:', err);
                                            } else {
                                                console.log('Directory created successfully!');
                                                fs.writeFile(`${relativeDirectory}/${what_dir}/${answers.what_filename}`, `console.log('Hello, World!')`, (err) => {
                                                    if (err) {
                                                        console.error('Error creating the file:', err);
                                                    } else {
                                                        console.log('File created successfully!');
                                                    }
                                                });
                                            }
                                        })

                                    })
                            })
                            .catch(error => {
                                console.error('Error occurred in what_dir block:', error);
                            });
                    }
                })
        } else {
            inquirer
                .prompt(pickFilePrompt)
                .then(answers => {
                    if (answers.pickFile === 'Yes') {

                        // fs.readdir(componentDirectory, (err, files) => {
                        //     if (err) {
                        //         console.error('Error reading directory:', err);
                        //     } else {
                        //         console.log('Files in the directory:', files);
                        //     }
                        // });


                        // Function to generate dynamic choices from files in a directory
                        async function generateDynamicChoices() {
                            // const directoryPath = './path/to/your/directory'; // Replace with the path of your directory
                            try {
                                const files = await fs.promises.readdir(componentDirectory);
                                return files;
                            } catch (error) {
                                console.error('Error reading directory:', error);
                                return [];
                            }
                        }

                        // Prompt definition
                        const prompt = {
                            type: 'list',
                            name: 'selectedFile',
                            message: 'Select a file from the directory:',
                            choices: generateDynamicChoices // Use the function as the choices property
                        };

                        // Ask the user to select a file from the directory
                        inquirer.prompt(prompt).then(answers => {
                            console.log('Selected file:', answers.selectedFile);
                            const selectedFilePath = `${componentDirectory}/${answers.selectedFile}`
                            try {
                                const data = fs.readFileSync(selectedFilePath, 'utf8');

                                inquirer
                                    .prompt(renameFilePrompt)
                                    .then(answers => {
                                        if (answers.rename === 'Yes') {
                                            inquirer
                                                .prompt(whatComponentPrompt)
                                                .then(answers => {

                                                    const newContent = data.replace(/!!NAME!!/g, answers.what_compname);

                                                    fs.writeFile(selectedFilePath, newContent, (err) => {
                                                        if (err) {
                                                            console.error('Error writing to file:', err);
                                                        } else {
                                                            console.log('File content changed successfully.');
                                                        }
                                                    });



                                                })
                                        }
                                    })
                                // console.log('File content:', data);
                            } catch (err) {
                                console.error('Error reading file:', err);
                            }

                        });
                    }
                })
        }
    })
    .catch(error => {
        console.error('Error occurred:', error);
    });