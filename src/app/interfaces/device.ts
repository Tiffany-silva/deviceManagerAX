export interface Device {
    id?:string,
    deviceName: string,
    serialNumber: string;
    purchasedDate:Date,
    insured:string,
    primaryUser:string,
    specification:string,
    remarks?:string,
    purchasedFrom:string,
    borrower?:string,
    recievedDate:Date,
    expenseBy:string,
    addedBy:any,
    deviceStatus:string
}


export interface Borrowing extends Device{
    deviceid:string,
    borrowedDate:string,
    returnedDate?:string
}

