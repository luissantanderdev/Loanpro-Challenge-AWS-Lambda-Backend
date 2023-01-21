import { ExcelSheetTestDatabase } from '../database_logic'; 

const MAX_LIMIT = 10E9; 

// MARK: Check if the Operation is Valid
function checkIfOperationIsValid(operation: string, balance: number, cost: number): string {
    let isValid: string = ''; 

    switch(operation) {
        case 'ADD':
            if (cost <= 0 || cost >= MAX_LIMIT) isValid = 'cost <= 0 || cost >= 10E9';
        break; 
        case 'SUBTRACT':
            if (balance <= 0 || cost > balance) isValid = 'balance <= 0 || cost > balance'; 
        break;
        case 'MULTIPLY':
            if (cost > 10E7) isValid = "cost multiply can't be higher than 10E7";
        break; 
        case 'DIVIDE':
            if (balance < 1) isValid = 'balance cant be less than 1 when dividing';
        break;
        case 'SQUAREROOT':
            if (balance < 1) isValid = 'balance cant be less than 1 when dividing';
        break; 
        default:
            isValid = 'random string passed no operation detected'; 
    }
    
    return isValid; 
}

// MARK: Process Arithmetic Operation
function runArithemticOperation(operation: string, balance: number, cost: number): number {

    switch(operation) {
        case 'ADD':
            balance += cost; 
        break; 
        case 'SUBTRACT':
            balance -= cost; 
        break;
        case 'MULTIPLY':
            balance *= cost; 
        break; 
        case 'DIVIDE':
            balance /= cost; 
        break;
        case 'SQUAREROOT':
            balance = Math.sqrt(balance); 
        break; 
        default:
    }

    return balance; 
}

// MARK: Process User Operation 
function processUserOperation(data: any) {
    const { DatabaseManagerController } = require('./controllers'); 
    const database = DatabaseManagerController.instance(); 

    database.setDatabase(new ExcelSheetTestDatabase())
    database.connect();
    
    let balance = database.query(`GET_BALANCE USER= ${data.userID}`);

    const operation = data.operation; 

    let isValid: string = checkIfOperationIsValid(operation, balance, data.cost); 

    if (isValid.length > 0) return { status: 'error', error: isValid }

    balance = runArithemticOperation(operation, balance, data.cost); 

    // database.query(`UPDATE_BALANCE USER= ${data.userID} BALANCE= ${balance}`);

    return {
        status: 'balance updated',
        date: new Date(),
        balance
    }
}


export { processUserOperation };