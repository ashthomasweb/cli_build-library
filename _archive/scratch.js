
// const inquirer = require('inquirer');

// const items = [
//   'Fixed Item 1',
//   'Fixed Item 2',
//   'Item 3',
//   'Item 4',
//   'Item 5',
//   // Add more items as needed
// ];

// const pageSize = 3; // Number of visible items excluding fixed items
// let currentIndex = 0;

// function renderList() {
//   const visibleItems = items.slice(currentIndex, currentIndex + pageSize);
//   const fixedItems = items.slice(0, currentIndex);
//   const formattedItems = [...fixedItems, ...visibleItems];

//   inquirer
//     .prompt([
//       {
//         type: 'list',
//         name: 'selectedItem',
//         message: 'Scrolling List with Fixed Items',
//         choices: formattedItems,
//       },
//     ])
//     .then(answer => {
//       // Handle user input here
//       console.log(`You selected: ${answer.selectedItem}`);
//     });
// }

// renderList();






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

