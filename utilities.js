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





const inquirer = require('inquirer');

const items = [
  'Fixed Item 1',
  'Fixed Item 2',
  'Item 3',
  'Item 4',
  'Item 5',
  // Add more items as needed
];

const pageSize = 3; // Number of visible items excluding fixed items
let currentIndex = 0;

function renderList() {
  const visibleItems = items.slice(currentIndex, currentIndex + pageSize);
  const fixedItems = items.slice(0, currentIndex);
  const formattedItems = [...fixedItems, ...visibleItems];

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'selectedItem',
        message: 'Scrolling List with Fixed Items',
        choices: formattedItems,
      },
    ])
    .then(answer => {
      // Handle user input here
      console.log(`You selected: ${answer.selectedItem}`);
    });
}

renderList();
