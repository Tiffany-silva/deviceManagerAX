import { EmailValidator } from '@angular/forms';

export interface User {
    userid:string,
    firstName: string,
    lastName: string,
    email: string,
    avatarURL?:string,
    role:string,
    status: string,
    modifiedDate?: Date,
    createdDate: Date;
}
