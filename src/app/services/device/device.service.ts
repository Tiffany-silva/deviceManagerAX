import { Device } from './../../interfaces/device';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// import * as firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore'

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  public deviceListRef: firebase.firestore.CollectionReference;
  private deviceCollection: AngularFirestoreCollection<any>;
    devices: Observable<Device[]>;
  // constructor() {
  //   // firebase.auth().onAuthStateChanged(user => {
  //   //   if (user) {
  //   //     this.deviceListRef = firebase
  //   //       .firestore()
  //   //       .collection(`/userProfile/${user.uid}/deviceList`);
  //   //   }
  //   // });
  
  
  // }
  constructor(private afs: AngularFirestore) {
    this.deviceCollection = afs.collection<Device>('Devices');
    this.devices = this.deviceCollection.valueChanges();
}

  addDevice(newDevice: Device): Promise<DocumentReference> {
    return this.deviceCollection.add(newDevice);
} 

getDeviceList(): Observable<any> {
    return this.afs.collection('/Devices').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Device;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));

}
  getDeviceDetail(deviceID: string) {
    return this.deviceListRef.doc(deviceID);
  }


}
