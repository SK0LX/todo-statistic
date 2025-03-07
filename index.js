const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function FindToDo() {
    let files = getFiles();
    let todoList = [];
    const regex = /\/\/\sTODO\s(.*)/; //если что, я смотрел презу, так вот .* - любые симвоыл после
    for (let fileLines of files) {
        let lines = fileLines.split('\n');
        for (let line of lines) {
            let match = line.match(regex);
            if (match) {
                todoList.push(`TODO: ${match[1].trim()}`)
            }
        }
    }
    return todoList;
}


function processCommand(command) {
    let todoList = FindToDo();
    if (command.startsWith('user ')){
        let username = command.substring(5).trim();
        for (let todo of todoList) {
            if (todo.includes(`${username}`)) {
                console.log(todo);
            }
        }   
    }else if (command.startsWith('date ')){
        let parts = command.substring(5).split('-');
        let year = parseInt(parts[0], 10);
        let month = parts[1] ? parseInt(parts[1], 10) - 1 : 0;
        let day = parts[2] ? parseInt(parts[2], 10) : 1;
        let filterDate = new Date(year, month, day);
        todoList.forEach(todo => {
            if (!todo.includes(';'))
                return;
            let todoDateString = todo.split(';')[1].trim();
            let todoParts = todoDateString.split('-');
            let todoYear = parseInt(todoParts[0], 10);
            let todoMonth = parseInt(todoParts[1], 10) - 1;
            let todoDay = parseInt(todoParts[2], 10);
            if (isNaN(todoYear) || isNaN(todoMonth) || isNaN(todoDay)) {
                return false; 
            }

            let todoDate = new Date(todoYear, todoMonth, todoDay);
            if (todoDate >= filterDate)
                console.log(todo);
        });
    } else if (command.startsWith('sort ')) {
        const sortArg = command.substring(5).trim();

        switch (sortArg) {
            case 'importance':
                todoList.sort((a, b) => {
                    const countA = (a.match(/!/g) || []).length; // п он типо находит ! и собирает все в массив
                    const countB = (b.match(/!/g) || []).length;//я бы сказал, он считает кол-во вхождений ! в to do
                    return countB - countA;
                });
                break;
            case 'user':
                todoList.sort((a, b) => {
                    const splittodoA = a.split(';').length;
                    const splittodoB = b.split(';').length;
                    return splittodoB - splittodoA;
                });
                break;
            case 'date':
                todoList.sort((a, b) => {
                    const splittodoA = a.split(';')[2];
                    const splittodoB = b.split(';')[2];
                    return splittodoB - splittodoA;
                });
                break;
            default:
                console.log('Invalid sort argument.');
                return;
        }

        for (let todo of todoList) {
            console.log(todo);
        }
    } else{
        switch (command) {
            case 'exit':
                process.exit(0);
                break;
            case 'show':
                for (let todo of todoList) {
                    console.log(todo);
                }
                break;
            case 'important':
                for (let todo of todoList) {
                    if (todo.includes('!')) {
                        console.log(todo);
                    }
                }
                break;
            default:
                console.log('wrong command');
                break;
        }
    }
}

// TODO you can do it!
