/**
 * device-detail.page.ts
 * @Author: Tiffany Silva
 * @Date: 04/09/2019
 * @Description: This represents the device-detail page that allows to
 *                  view detailed information of the selected device
 */

import { BorrowingService } from 'src/app/services/device/borrowing.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service'
import { ActivatedRoute } from '@angular/router';
import { Borrowing } from 'src/app/interfaces/device';
@Component({
	selector: 'app-device-detail',
	templateUrl: './device-detail.page.html',
	styleUrls: ['./device-detail.page.scss'],
})

export class DeviceDetailPage implements OnInit {

	public device: any;
	public id: string;
	public borrowings: any[] = [];
	public isEditable = false;
	public loading: any;
	public currentUser;
	public currentUsername;
	public currentUserRole;
	private subscriber;

	constructor(
		private deviceService: DeviceService,
		private route: ActivatedRoute,
		private alertCtrl: AlertController,
		private loadingCtrl: LoadingController,
		private userService: UserService,
		private authService: AuthenticationService,
		private borrowingService: BorrowingService) {

		//get the id of the selected device
		this.id = this.route.snapshot.paramMap.get('id');

		/**
		 * calls the getUserP method from the user service 
		 * 		to get the profile details
		 */
		this.userService.getUserP(this.authService.getUserDetails())
			.subscribe((documentSnapshot: firebase.firestore.DocumentSnapshot) => {
				this.subscriber = documentSnapshot.data();
				this.currentUserRole = this.subscriber.role;
				this.currentUsername = this.subscriber.firstName + " " + this.subscriber.lastName;

			});

		/**calls the getDeviceDetail method from the device service
		 * 		to get the device details from the device catalogue
		 */
		this.device = this.deviceService.getDeviceDetail(this.id).valueChanges().subscribe(data => {
			this.device = data;
		});

		/**
		 * calls the getBorrowingList method from the devices service to
		 * 		get the past borrowings made on the device
		 */
		this.deviceService.getBorrowingList(this.id).subscribe(myDeviceData => {
			this.borrowings = myDeviceData;
		});
	}

	ngOnInit() {
	}
	//changes the edit/done mode of edit profile
	editbtn() {
		this.isEditable = !this.isEditable;
	}
	//updates the primary user of the device
	async updatePrimaryUser(): Promise<void> {
		const alert = await this.alertCtrl.create({
			subHeader: "Primary User",
			inputs: [
				{ type: 'text', name: 'primaryuser', placeholder: 'Primary User Name' }
			],
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Save',
					handler: async data => {
						this.loading = await this.loadingCtrl.create();
						await this.loading.present();
						this.deviceService.updatePrimaryUser(data.primaryuser, this.id).then(async () => {
							this.loading.dismiss().then(async () => {
								this.alert('updated successfully');
							});
						},
							error => {
								this.loading.dismiss().then(async () => {
									this.alert(error);
								});
							});
					},
				},
			],
		});
		await alert.present();
	}
	//updates the specification of the device
	async updateSpecification(): Promise<void> {
		const alert = await this.alertCtrl.create({
			subHeader: "Specification",
			inputs: [
				{ type: 'text', name: 'specification', placeholder: 'specification' }
			],
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Save',
					handler: async data => {
						this.loading = await this.loadingCtrl.create();
						await this.loading.present();
						this.deviceService.updateSpecification(data.specification, this.id).then(async () => {
							this.loading.dismiss().then(async () => {
								this.alert('updated successfully!');
							});
						},
							error => {
								this.loading.dismiss().then(async () => {
									this.alert(error);
								});
							});
					},
				},
			],
		});
		await alert.present();
	}
	//updates the insured property of the device
	async updateInsured(): Promise<void> {
		const alert = await this.alertCtrl.create({
			subHeader: "Insured?",
			inputs: [
				{ type: 'text', name: 'insured', placeholder: 'Yes/No' }
			],
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Save',
					handler: async data => {
						this.loading = await this.loadingCtrl.create();
						await this.loading.present();
						this.deviceService.updateInsured(data.insured, this.id).then(async () => {
							this.loading.dismiss().then(async () => {
								this.alert('updated successfully!');
							});
						},
							error => {
								this.loading.dismiss().then(async () => {
									this.alert(error.message);
								});
							});
					},
				},
			],
		});
		await alert.present();
	}

	//alert function
	async alert(msg) {
		const alert = await this.alertCtrl.create({
			message: msg,
			buttons: [{ text: "OK", role: "cancel" }]
		});
		await alert.present();
	}
	//deletes a device from the device catalogue
	async deleteDevice() {
		const alert = await this.alertCtrl.create({
			message: "Are you sure you want to delete the device?",
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Save',
					handler: async data => {
						this.loading = await this.loadingCtrl.create();
						await this.loading.present();
						this.deviceService.deleteDevice(this.id).then(async () => {
							this.loading.dismiss().then(async () => {
								this.alert('updated successfully!');
							});
						});
					}
				}]
		})
		await alert.present();
	}

	//borrows a device from the device catalogue
	async borrowDevice(status: string) {

		const borrowing: Borrowing = {
			'deviceName': this.device.deviceName,
			'serialNumber': this.device.serialNumber,
			'purchasedDate': this.device.purchasedDate,
			'insured': this.device.insured,
			'primaryUser': this.device.primaryUser,
			'specification': this.device.specification,
			'remarks': this.device.remarks,
			'purchasedFrom': this.device.purchasedFrom,
			'recievedDate': this.device.recievedDate,
			'expenseBy': this.device.expenseBy,
			'addedBy': this.device.addedBy,
			'deviceStatus': status,
			'borrowedDate': new Date().toISOString(),
			'deviceid': this.id
		}
		this.deviceService.addBorrowing(this.id, this.currentUsername, borrowing.borrowedDate).then(
			() => {
				this.borrowingService.addBorrowing(borrowing);
				this.loading.dismiss().then(async () => {
					const alert = await this.alertCtrl.create({
						message: "Device Borrowed!",
						buttons: [{ text: "OK", role: "cancel" }]
					});
					await alert.present();
				});
			},
			error => {
				this.loading.dismiss().then(async () => {
					const alert = await this.alertCtrl.create({
						message: error.message,
						buttons: [{ text: "ok", role: "cancel" }]
					});
					await alert.present();
				});
			}
		);
		this.loading = await this.loadingCtrl.create();
		await this.loading.present();



	}
	//returns a device that is borrowed
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


