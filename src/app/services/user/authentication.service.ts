import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  constructor(private afu: AngularFireAuth) {}

  signup(email: string, password: string): Promise<any> {
    return this.afu.auth.createUserWithEmailAndPassword(email, password);
  }

  loginUser(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return this.afu.auth.signInWithEmailAndPassword(email, password);
  }

  logoutUser(): Promise<void> {
    return this.afu.auth.signOut();
  }

  resetPassword(email: string): Promise<void> {
    return this.afu.auth.sendPasswordResetEmail(email);
  }

  getUserDetails() {
    return this.afu.auth.currentUser.uid;
  }
}
