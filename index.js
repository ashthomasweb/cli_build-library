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
        type: 'input',
        name: 'name',
        message: 'What is your name?'
    },
    {
        type: 'list',
        name: 'create',
        message: 'Create a file?',
        choices: ['Yes', 'No']
    },
    {
        type: 'list',
        name: 'src_directory',
        message: 'In the /src directory?',
        choices: ['Yes', 'No']
    },
];

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



const relativeDirectory = 'c:/Users/rideo/Dropbox/Code/projects/cli/initial-test'

inquirer
    .prompt(questions)
    .then(answers => {
        console.log(`Hello, ${answers.name}!`);
        if (answers.create === 'Yes') {

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

                            fs.mkdir(`${relativeDirectory}/${what_dir}`, {recursive: true}, (err) => {
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
        }
    })
    .catch(error => {
        console.error('Error occurred:', error);
    });