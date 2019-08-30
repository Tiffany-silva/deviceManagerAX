import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userCollection: AngularFirestoreCollection<User>;
    users: Observable<User[]>;
    userList: User[] = [];
    constructor(private afs: AngularFirestore) {
        this.userCollection = afs.collection<User>('Users');
        this.users = this.userCollection.valueChanges();
    }
    addUser(newUser: User): Promise<DocumentReference> {
        return this.userCollection.add(newUser);
    } 

    getUsers(): Observable<any> {
        return this.afs.collection('/Users').snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as User;
            const id = a.payload.doc.id;
            return { id, ...data };
          })));
    
    }

    getUserById(id: string): Observable<User[]> {
      const userDocuments = this.afs.collection<User[]>('Users');
      return userDocuments.snapshotChanges()
        .pipe(
          map(changes => changes.map(({ payload: { doc } }) => {
            const data = doc.data();
            const id = doc.id
            return { id, ...data };
          })),
          map((users) => users.find(doc => doc.id === id)));
    }
    
    async getUserName(id:string):Promise<any>{
      await this.getUsers().subscribe(userData => {
        this.userList = userData;
      });
      this.userList.forEach(user=>{
        if(user.userid===id){
          return user.firstName + " " + user.lastName; 
        }
      })
    }
}

  

  // addUser(newUser: User):Promise<DocumentReference> {
  //   return this.userCollection.add(newUser);
  // }

  // getUserProfile(): firebase.firestore.DocumentReference {
  //   return this.userProfile;
  // }

  // updateName(firstName: string, lastName: string): Promise<any> {
  //   return this.userProfile.update({ firstName, lastName });
  // }

  // updateEmail(newEmail: string, password: string): Promise<any> {
  //   const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
  //     this.currentUser.email,
  //     password
  //   );
  //   return this.currentUser
  //     .reauthenticateWithCredential(credential)
  //     .then(() => {
  //       this.currentUser.updateEmail(newEmail).then(() => {
  //         this.userProfile.update({ email: newEmail });
  //       });
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }

  // updatePassword(newPassword: string, oldPassword: string): Promise<any> {
  //   const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
  //     this.currentUser.email,
  //     oldPassword
  //   );
  //   return this.currentUser
  //     .reauthenticateWithCredential(credential)
  //     .then(() => {
  //       this.currentUser.updatePassword(newPassword).then(() => {
  //         console.log('Password Changed');
  //       });
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }
// }

