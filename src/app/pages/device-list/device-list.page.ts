import { Component, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {
  public deviceList: Array<any>;
  constructor(private deviceService: DeviceService) {}
  
  ngOnInit() {
    this.deviceService
      .getDeviceList()
      .get()
      .then(deviceListSnapshot => {
        this.deviceList = [];
        deviceListSnapshot.forEach(snap => {
          this.deviceList.push({
            id: snap.id,
            name: snap.data().name,
            price: snap.data().serialNum,
          });
          return false;
        });
      });
  }


}
