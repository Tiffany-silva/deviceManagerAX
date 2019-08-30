import { Component, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service'
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.page.html',
  styleUrls: ['./device-detail.page.scss'],
})
export class DeviceDetailPage implements OnInit {

  public currentDevice: any = {};
  public deviceList=[
    {
      deviceName: "iPhone",
      serialNumber: "12345"
    },
    {
      deviceName: "iPhone",
      serialNumber: "12345"
    },
    {
      deviceName: "iPhone",
      serialNumber: "12345"
    },
    {
      deviceName: "iPhone",
      serialNumber: "12345"
    }
  ];
  constructor(
    private deviceService: DeviceService,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    const id: string = this.route.snapshot.paramMap.get('id');
    this.getDevice(id);
    // this.deviceService
    //   .getDeviceDetail(deviceID)
    //   .get()
    //   .then(deviceSnapshot => {
    //     this.currentDevice = deviceSnapshot.data();
    //     this.currentDevice.id = deviceSnapshot.id;
    //   });


  }

  getDevice(name:string){
    this.deviceList.forEach(element => {
      if(element.deviceName===name){
        this.currentDevice=element;
      }else{
        console.log("no such device");
      }
    });
  }

  

  }


