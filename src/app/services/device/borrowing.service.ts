/**
 * borrowing.service.ts
 * @Author: Tiffany Silva
 * @Date: 04/09/2019
 * @Description: This represents the borrowing service 
 *      that provides service to borrowings made.
 */

import { Borrowing } from './../../interfaces/device';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class BorrowingService {

	public borrowedDevices: Observable<Borrowing[]>;
	public currentUser;

	constructor(private db: AngularFirestore, private auth: AngularFireAuth) {
		//gets the current logged in user
		this.currentUser = auth.auth.currentUser;
		this.auth.auth.onAuthStateChanged(user => {
			if (user) {
				this.currentUser = user;
			}
		})
	}
	//adds a borrowing made to the logged in user
	addBorrowing(newBorrowing: Borrowing): Promise<DocumentReference> {
		let borrowing: any;
		borrowing = this.db.collection<Borrowing>(`/Users/${this.currentUser.uid}/borrowings`);
		return borrowing.add(newBorrowing);
	}
	//gets all the borrowings made by the logged in user
	getBorrowings(userID: string): Observable<any> {
		return this.db.collection(`/Users/${userID}/borrowings`).snapshotChanges().pipe(
			map(actions => actions.map(a => {
				const data = a.payload.doc.data() as Borrowing;
				const id = a.payload.doc.id;
				return { id, ...data };
			})
		));
	}

	//gets detailed information of a provided borrowing id
	getBorrowingDetail(userID: string): AngularFirestoreDocument {
		return this.db.collection(`/Users/${this.currentUser.uid}/borrowings`).doc(userID);
	}
	//returns a borrowed device
	returnDevice(deviceStatus: string, id: string): Promise<any> {
		let borrowing;
		borrowing = this.db.doc(`/Users/${this.currentUser.uid}/borrowings/${id}`);
		return borrowing.update({ deviceStatus });
	}

}
