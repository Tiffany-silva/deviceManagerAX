/**
 * authentication.service.ts
 * @Author: Tiffany Silva
 * @Date: 04/09/2019
 * @Description: This represents the authentication service that
 *        provides service for authentication.
 */
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: "root"
})
export class AuthenticationService {
	
	public user: any;
	public role: string;

	constructor(
		private afu: AngularFireAuth,
		private userService: UserService) { }

		//signs up the user authenticating
	signup(email: string, password: string): Promise<any> {
		return this.afu.auth.createUserWithEmailAndPassword(email, password);
	}
		//logs in the user
	loginUser(
		email: string,
		password: string
	): Promise<firebase.auth.UserCredential> {
		return this.afu.auth.signInWithEmailAndPassword(email, password);
	}
		//logs out the user
	logoutUser(): Promise<void> {
		return this.afu.auth.signOut();
	}

		//resets the password
	resetPassword(email: string): Promise<void> {
		return this.afu.auth.sendPasswordResetEmail(email);
	}

		//gets the current logged in user
	getUserDetails() {
		return this.afu.auth.currentUser.uid;
	}
}
