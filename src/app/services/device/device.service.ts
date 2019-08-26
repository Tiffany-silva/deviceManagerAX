import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  public deviceListRef: firebase.firestore.CollectionReference;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.deviceListRef = firebase
          .firestore()
          .collection(`/userProfile/${user.uid}/deviceList`);
      }
    });
  }

  createDevice(devicename: string, serialNum: number
  ): Promise<firebase.firestore.DocumentReference> {
    return this.deviceListRef.add({
      name: devicename,
      serialNumber: serialNum,
    });
  }
  
  getDeviceList(): firebase.firestore.CollectionReference {
    return this.deviceListRef;
  }
  
  getDeviceDetail(deviceID: string): firebase.firestore.DocumentReference {
    return this.deviceListRef.doc(deviceID);
  }


}
