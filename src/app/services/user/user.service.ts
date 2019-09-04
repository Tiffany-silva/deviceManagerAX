/**
 * user.service.ts
 * @Author: Tiffany Silva
 * @Date: 04/09/2019
 * @Description: This represents the user service 
 *    that provides service for user management.
 */

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
	public users: Observable<User[]>;
	public currentUser;
	public userProfile: AngularFirestoreDocument;

	constructor(private db: AngularFirestore, private auth: AngularFireAuth) {
		//gets the currently logged in user
		this.currentUser = auth.auth.currentUser;
		this.auth.auth.onAuthStateChanged(user => {
			if (user) {
				this.currentUser = user;
				this.userProfile = db.doc(`/Users/${user.uid}`);
			}
		})
		this.userCollection = db.collection<User>('Users');
		this.users = this.userCollection.valueChanges();
	}
	//adds the user 
	addUser(newUser: User, userID: string): Promise<any> {
		return this.userCollection.doc(userID).set(newUser);
	}
	//gets all registered users
	getUsers(): Observable<any> {
		return this.db.collection('/Users').snapshotChanges().pipe(
			map(actions => actions.map(a => {
				const data = a.payload.doc.data() as User;
				const id = a.payload.doc.id;
				return { id, ...data };
			})
		));

	}

	//updates the name of the user provided
	updateName(firstName: string, lastName: string): Promise<any> {
		return this.userProfile.update({ firstName, lastName });
	}

	//updates the user status of the user provided
	updateUserStatus(status: string, userid: string): Promise<any> {
		let user;
		user = this.db.doc(`/Users/${userid}`);
		return user.update({ status });
	}
	
	//updates the user role of the user provided
	updateUserRole(role: string, userid: string): Promise<any> {
		let user;
		user = this.db.doc(`/Users/${userid}`);
		return user.update({ role });
	}

	//gets detailed user information
	getUser(userID: string): AngularFirestoreDocument {
		return this.db.collection('Users').doc(userID);
	}

	//updates the email of the provided user
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

	//updates the password of the provided user
	updatePassword(newPassword: string, oldPassword: string): Promise<any> {
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

	//gets the username 
	getUserName(id: string) {
		return this.db.collection('Users').doc(id).snapshotChanges();

	}
	//returns the currently logged in user details
	getUserProfile() {
		return this.userProfile;
	}
	//get user information
	getUserP(id: string) {
		return this.db.collection('Users').doc(id).get();
	}

	//deletes the give user
	deleteUser(userid: string) {
		let user;
		user = this.db.doc(`/Users/${userid}`);
		return user.delete();
	}

}

