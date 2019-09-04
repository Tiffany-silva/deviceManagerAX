/**
 * tabs.page.ts
 * @Author: Tiffany Silva
 * @Date: 04/09/2019
 * @Description: This represents the tabs used to navigate.
 */

import { UserService } from 'src/app/services/user/user.service';
import { AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
@Component({
	selector: 'app-tabs',
	templateUrl: 'tabs.page.html',
	styleUrls: ['tabs.page.scss'],
	providers: [BarcodeScanner]
})

export class TabsPage {
	public subscriber;
	public currentUserRole;
	constructor(
		private authService: AuthenticationService,
		private barcodeScanner: BarcodeScanner,
		private router: Router,
		private alertCtrl: AlertController,
		private userService: UserService
	) {
		//calls the getUserP method from user service to get the current user profile
		this.userService.getUserP(this.authService.getUserDetails())
			.subscribe((documentSnapshot: firebase.firestore.DocumentSnapshot) => {
				this.subscriber = documentSnapshot.data();
				this.currentUserRole = this.subscriber.role;
			}
		);
	}
	//directs to the profile of the current logged in user
	navProfile(id: string) {
		this.router.navigate([`../profile/${this.authService.getUserDetails()}`]);
	}

	//scans the barcode and directs to the device detail page
	async scanNnavigate() {
		this.barcodeScanner
			.scan()
			.then(barcodeData => {
				let id = JSON.parse(JSON.stringify(barcodeData)).text;
				this.router.navigateByUrl(`/device-detail/${id}`);
			})
			.catch(async err => {
				const alert = await this.alertCtrl.create({
					message: "Device not Found!",
					buttons: [{ text: "OK", role: "cancel" }]
				});
				await alert.present();
			}
		);
	}
}


