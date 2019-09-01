import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userCollection: AngularFirestoreCollection<User>;
    users: Observable<User[]>;
    public currentUser;
    public userProfile:AngularFirestoreDocument;
    constructor(private db: AngularFirestore, private auth:AngularFireAuth) {
        this.currentUser=auth.auth.currentUser;
        this.auth.auth.onAuthStateChanged(user=>{
          if(user){
            this.currentUser=user;
            this.userProfile=db.doc(`/Users/${user.uid}`);
          }
        })
        this.userCollection = db.collection<User>('Users');
        this.users = this.userCollection.valueChanges();
    }
    addUser(newUser: User, userID:string): Promise<any> {
        return this.userCollection.doc(userID).set(newUser);
    } 



    getUsers(): Observable<any> {
        return this.db.collection('/Users').snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as User;
            const id = a.payload.doc.id;
            return { id, ...data };
          })));
    
    }

    updateName(firstName: string, lastName: string): Promise<any> {
      return this.userProfile.update({ firstName, lastName });
    }

    getUserD(userID: string){
      return this.db.collection('Users').doc(userID);
    }

    updateEmail(newEmail: string, password: string): Promise<any> {
      const credential: firebase.auth.AuthCredential = auth.EmailAuthProvider.credential(
        this.currentUser.email,
        password
      );
      return this.currentUser
        .reauthenticateWithCredential(credential)
        .then(() => {
          this.currentUser.updateEmail(newEmail).then(() => {
            this.userProfile.update({ email: newEmail });
          });
        })
        .catch(error => {
          console.error(error);
        });
    }

    updatePassword(newPassword: string, oldPassword: string):Promise<any>{
      const credential: firebase.auth.AuthCredential = auth.EmailAuthProvider.credential(
        this.currentUser.email,
        oldPassword
      );
      return this.currentUser
        .reauthenticateWithCredential(credential)
        .then(() => {
          this.currentUser.updatePassword(newPassword).then(() => {
            console.log('Password changed');
          });
        })
        .catch(error => {
          console.error(error);
        });
    }

    getUserName(id:string){
      return this.db.collection('Users').doc(id).snapshotChanges();

    }

    getUserProfile(){
      return this.userProfile;
    }
  }

