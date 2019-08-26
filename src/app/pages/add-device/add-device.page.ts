import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.page.html',
  styleUrls: ['./add-device.page.scss'],
})
export class AddDevicePage implements OnInit {

  constructor(
    private router: Router, 
    private deviceService: DeviceService) 
    {}


  ngOnInit() {
  }
 
  addDevice( devicename: string, serialNum: number): void {
    if (
      devicename === undefined ||
      serialNum === undefined
    ) {
      return;
    }
    this.deviceService
      .createDevice(devicename, serialNum)
      .then(() => {
        this.router.navigateByUrl('');
      });
  }
}
