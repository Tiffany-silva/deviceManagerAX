import { UserService } from './../../services/user/user.service';
import { AuthenticationService } from './../../services/user/authentication.service';
import { Device } from './../../interfaces/device';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device/device.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { resolve } from 'url';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.page.html',
  styleUrls: ['./add-device.page.scss'],
  providers:[AngularFirestore]
})
export class AddDevicePage implements OnInit {
  addDeviceForm: FormGroup;
  errorMessage: string = '';
  public loading: HTMLIonLoadingElement;
  public currentUser:any;
  public name:string;
  constructor(
    private deviceService: DeviceService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserService) 
    {this.addDeviceForm = this.formBuilder.group({
      deviceName: [
        '', Validators.compose([Validators.required]),
      ],
      serialNumber: [
        '', Validators.compose([Validators.required]),
      ],
      purchasedDate: [
        '', Validators.compose([Validators.required]),
      ],
      insured: [
        '', Validators.compose([Validators.required]),
      ],
      primaryUser: [
        '', Validators.compose([Validators.required]),
      ],
      purchasedFrom: [
        '', Validators.compose([Validators.required]),
      ],
      specification: [
        '', Validators.compose([Validators.required]),
      ],
      receivedDate: [
        '', Validators.compose([Validators.required]),
      ],
      expenseBy: [
        '', Validators.compose([Validators.required]),
      ],
      status: [
        '', Validators.compose([Validators.required]),
      ],
    }
    );
  }


  ngOnInit() {
  }


  async addDevice(addDeviceForm: FormGroup): Promise<void> {
    if (!addDeviceForm.valid) {
      console.log('Need to complete the form, current value: ', addDeviceForm.value);
    } else {
      const deviceName: string = addDeviceForm.value.deviceName;
      const serialNumber: string=addDeviceForm.value.serialNumber;
      const purchasedDate: Date=addDeviceForm.value.purchasedDate;
      const insured: string=addDeviceForm.value.insured;
      const primaryUser: string=addDeviceForm.value.primaryUser;
      const specification: string=addDeviceForm.value.specification;
      const purchasedFrom: string=addDeviceForm.value.purchasedFrom;
      const receivedDate: Date=addDeviceForm.value.receivedDate;
      const expenseBy: string=addDeviceForm.value.expenseBy;
      const status: string=addDeviceForm.value.status;
      let addedBy;
      this.userService.getUserName(this.authService.getUserDetails()).subscribe(
       async data =>{
          if(data){
            this.currentUser=data.payload.data();
            
      const device : Device={

        'deviceName': deviceName,
        'serialNumber':serialNumber,
        'purchasedDate':purchasedDate,
        'insured':insured,
        'primaryUser':primaryUser,
        'specification': specification,
        'remarks':'',
        'purchasedFrom': purchasedFrom,
        'borrower': '',
        'recievedDate':receivedDate,
        'expenseBy':expenseBy,
        'addedBy': this.currentUser.firstName + " " + this.currentUser.lastName,
        'deviceStatus':status,
        
      }
  
      this.deviceService
        .addDevice(device)
        .then(() => {
          this.loading.dismiss().then(async() => {
            const alert= await this.alertCtrl.create({
              message: 'Added Successfully!',
              buttons: [{text: 'OK', role: 'cancel'}],
            });
            await alert.present();
            this.router.navigateByUrl('device-list');
          });
          
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'ok', role: 'cancel' }],
            });
            await alert.present();
          });
        }
      );
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();
          }
        }
      );

    }
  }
 
  

}
