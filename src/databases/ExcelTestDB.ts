const XLSX = require('xlsx'); 
import { Database } from "../models";

class ExcelSheetTestDatabase implements Database {
    private workbook: any;
    private sheetNames: any; 
    private db: any; 

    // MARK: Obtain user data if user on Dummy Excel Sheet Test DB 
    private findUser(username: string, password: string): any {
        console.log(username, password);
        const db = XLSX.utils.sheet_to_json(this.workbook.Sheets[this.sheetNames[0]]);
        
        let user: any = null; 

        db.forEach((userRecord: any) => {
                if (userRecord.username === username) {
                        user = userRecord; 
                        return; 
                }
        }); 

        if (!user) throw Error("User not found in excel sheet database"); 
        
        return user; 
    }

    // MARK: Connect to the XLSX Dummy DB 
    connect(): void {
        console.log("connecting inside excel db"); 

        try {
            this.workbook = XLSX.readFile(__dirname + '/test-data/users_db.xlsx');
            this.sheetNames = this.workbook.SheetNames;
        } catch (error) {
            console.log('database not found'); 
            this.disconnect(); 
        }
    }

    // MARK: Disconnect from the database 
    disconnect(): void {
        console.log("disconnecting from excel test db"); 
    }

    // MARK: Query the database 
    query(q: string): void {
        console.log("quering the database"); 

        let params = q.split(' '); 

        let response: any = null; 

        if (params.length === 3) {
            
            const command = params[0]; 
            
            switch (command) {
                case "AUTH":
                    response = this.findUser(params[1], params[2])
                break; 
                default: 
            }
        }

        if (!response) throw Error("Invalid Query");  

        return response; 
    }
}


export { ExcelSheetTestDatabase }