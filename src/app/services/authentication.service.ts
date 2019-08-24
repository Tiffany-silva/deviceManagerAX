import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  signup(email: string, password:string): Promise<any> {
    return firebase.auth()
    .createUserWithEmailAndPassword(email, password)
      .then((newUserCredential: firebase.auth.UserCredential)=>{
        firebase
        .firestore()
        .doc(`/userProfile/${newUserCredential.user.uid}`)
        .set({email});
      })
      .catch(error =>{
        console.error(error);
        throw new Error(error);
      });
  }

  loginUser(
    email:string, 
    password:string
    ): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email,password);
  }

  logoutUser():Promise <void>{
    return firebase.auth().signOut();
  }

  resetPassword(email:string):Promise <void>{
    return firebase.auth().sendPasswordResetEmail(email);
  }

  userDetails(){
    return firebase.auth().currentUser;
  }

}
