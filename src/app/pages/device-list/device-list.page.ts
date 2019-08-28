import { Component, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
  providers:[BarcodeScanner]
})
export class DeviceListPage implements OnInit {
  public deviceList=[
    {
      deviceName: "iPhone",
      serialNumber: "12345"
    },
    {
      deviceName: "iPhone1",
      serialNumber: "12345"
    },
    {
      deviceName: "iPhone2",
      serialNumber: "12345"
    },
    {
      deviceName: "iPhone3",
      serialNumber: "12345"
    }
  ];
  constructor(private deviceService: DeviceService, private barcodeScanner: BarcodeScanner) {}
  
  ngOnInit() {
    // this.deviceService
    //   .getDeviceList()
    //   .get()
    //   .then(deviceListSnapshot => {
    //     this.deviceList = [];
    //     deviceListSnapshot.forEach(snap => {
    //       this.deviceList.push({
    //         id: snap.id,
    //         name: snap.data().name,
    //         price: snap.data().serialNum,
    //       });
    //       return false;
    //     });
    //   });
  }

  scan(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
     }).catch(err => {
         console.log('Error', err);
     });
  }
  


}
