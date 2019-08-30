import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { Device } from './../../interfaces/device';
import { Component, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
  providers:[BarcodeScanner]
})
export class DeviceListPage implements OnInit {
  
  deviceList: Device[]=[];

  constructor(private deviceService: DeviceService, private barcodeScanner: BarcodeScanner) {}
  
  ngOnInit() {
    this.deviceService.getDeviceList().subscribe(deviceData=>{
      this.deviceList=deviceData;
    });
  }
  

  getUserName():string{
    return 'jane';
  }

  scan(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
     }).catch(err => {
         console.log('Error', err);
     });
  }
  


}
