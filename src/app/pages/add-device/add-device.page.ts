/**
 * add-device.page.ts
 * @Author: Tiffany Silva
 * @Date: 04/09/2019
 * @Description: This represents the add device page that allows the user to add
 *                  devices/register devices to the device catalogue
 */

import { UserService } from './../../services/user/user.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Device } from './../../interfaces/device';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device/device.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
	selector: 'app-add-device',
	templateUrl: './add-device.page.html',
	styleUrls: ['./add-device.page.scss'],
	providers: [AngularFirestore]
})

export class AddDevicePage implements OnInit {

	public addDeviceForm: FormGroup;
	public errorMessage: string = '';
	public loading: HTMLIonLoadingElement;
	public currentUser: any; //holds the current user
	public name: string;

	constructor(
		private deviceService: DeviceService,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		private router: Router,
		private formBuilder: FormBuilder,
		private authService: AuthenticationService,
		private userService: UserService) {                //initializing validators to the input fields
		this.addDeviceForm = this.formBuilder.group({
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
		}
		);
	}

	ngOnInit() {
	}

	//add a devices to the device catalogue
	async addDevice(addDeviceForm: FormGroup): Promise<void> {      
		if (!addDeviceForm.valid) {           //check if all input fields are entered
			const alert = await this.alertCtrl.create({
				message: 'Need to complete the form',
				buttons: [{ text: 'OK', role: 'cancel' }],
			});
			await alert.present();
		} else {
			const deviceName: string = addDeviceForm.value.deviceName;        //get values from the form
			const serialNumber: string = addDeviceForm.value.serialNumber;
			const purchasedDate: Date = addDeviceForm.value.purchasedDate;
			const insured: string = addDeviceForm.value.insured;
			const primaryUser: string = addDeviceForm.value.primaryUser;
			const specification: string = addDeviceForm.value.specification;
			const purchasedFrom: string = addDeviceForm.value.purchasedFrom;
			const receivedDate: Date = addDeviceForm.value.receivedDate;
			const expenseBy: string = addDeviceForm.value.expenseBy;

			this.userService.getUserName(this.authService.getUserDetails()).subscribe(    //get the current user
				async data => {
					if (data) {
						this.currentUser = data.payload.data();

						const device: Device = {

							'deviceName': deviceName,
							'serialNumber': serialNumber,
							'purchasedDate': purchasedDate,
							'insured': insured,
							'primaryUser': primaryUser,
							'specification': specification,
							'remarks': '',
							'purchasedFrom': purchasedFrom,
							'borrower': '',
							'recievedDate': receivedDate,
							'expenseBy': expenseBy,
							'addedBy': this.currentUser.firstName + " " + this.currentUser.lastName,
							'deviceStatus': 'Available',

						}

						
						 //calls the addDevice method from the device service to 
						   // add the device to the device catalogue
						this.deviceService
							.addDevice(device)
							.then(() => {
								this.loading.dismiss().then(async () => {
									const alert = await this.alertCtrl.create({
										message: 'Added Successfully!',
										buttons: [{ text: 'OK', role: 'cancel' }],
									});
									await alert.present();
									this.router.navigateByUrl('tabs');
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
				},
				err => {
					this.loading.dismiss().then(async () => {
						const alert = await this.alertCtrl.create({
							message: err.message,
							buttons: [{ text: 'ok', role: 'cancel' }],
						});
						await alert.present();
					});
				}
			);

		}
	}
}
