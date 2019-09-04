/**
 * device.service.ts
 * @Author: Tiffany Silva
 * @Date: 04/09/2019
 * @Description: This represents the device service that
 *    provides service for device management
 */

import { Device } from './../../interfaces/device';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
@Injectable({
	providedIn: 'root'
})
export class DeviceService {

	public deviceListRef: firebase.firestore.CollectionReference;
	private deviceCollection: AngularFirestoreCollection<any>;
	public devices: Observable<Device[]>;


	constructor(private db: AngularFirestore) {
		this.deviceCollection = db.collection<Device>('Devices');
		this.devices = this.deviceCollection.valueChanges();
	}
	//adds a device to the device catalogue
	addDevice(newDevice: Device): Promise<DocumentReference> {
		return this.deviceCollection.add(newDevice);
	}
	//updates the device status of a give device id
	updateDeviceStatus(deviceStatus: string, deviceid: string): Promise<any> {
		let device;
		device = this.db.doc(`/Devices/${deviceid}`);
		return device.update({ deviceStatus });
	}
	//updates the device borrower of the given device id
	updateDeviceBorrower(borrower: string, deviceid: string): Promise<any> {
		let device;
		device = this.db.doc(`/Devices/${deviceid}`);
		return device.update({ borrower });
	}

	//gets the registered list of devices
	getDeviceList(): Observable<any> {
		return this.db.collection('/Devices').snapshotChanges().pipe(
			map(actions => actions.map(a => {
				const data = a.payload.doc.data() as Device;
				const id = a.payload.doc.id;
				return { id, ...data };
			})));

	}
	//gets the detailed information of the given device id
	getDeviceDetail(id: string) {
		return this.db.collection('Devices').doc(id);
	}

	//adds a borrowing to the provided device id 
	addBorrowing(deviceID: string, user: string, borrowedDate: string) {
		let borrowings;
		borrowings = this.db.collection(`/Devices/${deviceID}/borrowings`);
		return borrowings.add({ user: user, borrowedDate: borrowedDate }).then((newBorrowing) => {
			let device;
			device = this.db.doc(`/Devices/${deviceID}`);
			device.update({ deviceStatus: 'borrowed', borrower: user });
			//TO-DO
			// return firebase.firestore().runTransaction(transaction=>{
			//   return transaction.get(this.deviceListRef.doc(deviceID)).then(devDoc=>{
			//     transaction.update(this.deviceListRef.doc(deviceID),{deviceStatus: 'borrowed', borrower: user})
			//   })
			// })
		});
	}
	//gets the past borrowing list of the device
	getBorrowingList(deviceID: string): Observable<any> {
		return this.db.collection(`/Devices/${deviceID}/borrowings`).snapshotChanges().pipe(
			map(actions => actions.map(a => {
				const data = a.payload.doc.data();
				const id = a.payload.doc.id;
				return { id, ...data };
			})));

	}
	//updates the insured property of the device
	updateInsured(insured: string, deviceid: string): Promise<any> {
		let device;
		device = this.db.doc(`/Devices/${deviceid}`);
		return device.update({ insured });
	}
	//updates the primary user of the device
	updatePrimaryUser(primaryUser: string, deviceid: string): Promise<any> {
		let device;
		device = this.db.doc(`/Devices/${deviceid}`);
		return device.update({ primaryUser });
	}
	//updates the specification of the device
	updateSpecification(specification: string, deviceid: string): Promise<any> {
		let device;
		device = this.db.doc(`/Devices/${deviceid}`);
		return device.update({ specification });
	}
	//deletes the corresponding device of the given device id
	deleteDevice(deviceid: string) {
		let device;
		device = this.db.doc(`/Devices/${deviceid}`);
		return device.delete();
	}
}
