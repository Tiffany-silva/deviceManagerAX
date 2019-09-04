/**
 * add-device.page.ts
 * @Author: Tiffany Silva
 * @Date: 04/09/2019
 * @Description: This represents the device list that displays the
 * device catalogue
 */

import { BorrowingService } from "./../../services/device/borrowing.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { Device,Borrowing } from "./../../interfaces/device";
import { Component, OnInit } from "@angular/core";
import { DeviceService } from "src/app/services/device/device.service";
import { UserService } from "src/app/services/user/user.service";
import { LoadingController, AlertController } from "@ionic/angular";
@Component({
	selector: "app-device-list",
	templateUrl: "./device-list.page.html",
	styleUrls: ["./device-list.page.scss"],
})

export class DeviceListPage implements OnInit {

	public deviceList: Device[] = [];
	public loading: HTMLIonLoadingElement;
	public currentUser: any;
	public subscriber;
	public myBorrowedDevices: Borrowing[] = [];
	public currentUsername: any;
	public currentUserRole;
	public id;
	constructor(
		private deviceService: DeviceService,
		private borrowingService: BorrowingService,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		private authService: AuthenticationService,
		private userService: UserService
	) {
		/**
		 * calls the getUserP method from the user service to 
		 * 		get the profile of the current logged in user
		 */
		this.userService.getUserP(this.authService.getUserDetails())
			.subscribe((documentSnapshot: firebase.firestore.DocumentSnapshot) => {
				this.subscriber = documentSnapshot.data();
				this.currentUserRole = this.subscriber.role;
				this.currentUsername = this.subscriber.firstName + " " + this.subscriber.lastName
		});

		/**
		 * calls the getBorrowings method from the borrowing service
		 * 		to get all the borrowings made by the current logged in
		 * 			user
		 */
		this.borrowingService.getBorrowings(this.authService.getUserDetails()).subscribe(myDeviceData => {
			this.myBorrowedDevices = myDeviceData;
		});

		/**
		 * calls the getDeviceList method from the device service 
		 * 		to get all the devices in the device catalogue
		 */
		this.deviceService.getDeviceList().subscribe(deviceData => {
			this.deviceList = deviceData;
		});
	}

	ngOnInit() { }

	//borrows a device from the device catalogue
	async borrowDevice(device: Device, status: string) {
		const alert = await this.alertCtrl.create({
			message: "Are you sure you want to borrow the Device?",
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Yes',
					handler: async data => {
						this.loading = await this.loadingCtrl.create();
						await this.loading.present();
						
						const borrowing: Borrowing = {
							'deviceName': device.deviceName,
							'serialNumber': device.serialNumber,
							'purchasedDate': device.purchasedDate,
							'insured': device.insured,
							'primaryUser': device.primaryUser,
							'specification': device.specification,
							'remarks': device.remarks,
							'purchasedFrom': device.purchasedFrom,
							'recievedDate': device.recievedDate,
							'expenseBy': device.expenseBy,
							'addedBy': device.addedBy,
							'deviceStatus': status,
							'borrowedDate': new Date().toISOString().slice(0, 10),
							'deviceid': device.id
						}

						//adds a new borrowing to the device
						this.deviceService.addBorrowing(device.id, this.currentUsername, borrowing.borrowedDate).then(
							() => {
								//adds a borrowing transaction to the current logged in user
								this.borrowingService.addBorrowing(borrowing);
								this.loading.dismiss().then(async () => {
									this.alert('Device Borrowed!');
								});
							},
							error => {
								this.loading.dismiss().then(async () => {
									this.alert(error.message);
								});
							}
						);
					}
				}]
		})
		await alert.present();
	}
	//alert method
	async alert(msg: string) {
		const alert = await this.alertCtrl.create({
			message: msg,
			buttons: [{ text: "OK", role: "cancel" }]
		});
		await alert.present();
	}
	//allows to return devices that are borrowed by the current logged in user
	async returnDevice(borrowingid: string, deviceid: string, deviceStatus: string) {
		const alert = await this.alertCtrl.create({
			message: "Are you sure you want to return the Device?",
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Yes',
					handler: async data => {
						this.loading = await this.loadingCtrl.create();
						await this.loading.present();

						this.borrowingService.returnDevice('Returned', borrowingid).then(async () => {
							this.deviceService.updateDeviceStatus(deviceStatus, deviceid);
							this.deviceService.updateDeviceBorrower('', deviceid);
							this.loading.dismiss().then(async () => {
								this.alert('Device Returned');
							});
						}, error => {
							this.alert(error);
						});
					}
				}]
		})
		await alert.present();
	}
}
