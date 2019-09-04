/**
 * user-list.page.ts
 * @Author: Tiffany Silva
 * @Date: 04/09/2019
 * @Description: This represents the user list page that
 *      displays the registered users.
 */

import { AlertController, LoadingController } from '@ionic/angular';
import { UserService } from "./../../services/user/user.service";
import { Component, OnInit } from "@angular/core";
import { User } from "src/app/interfaces/user";
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';
@Component({
	selector: "app-user-list",
	templateUrl: "./user-list.page.html",
	styleUrls: ["./user-list.page.scss"]
})

export class UserListPage implements OnInit {

	public userList: User[] = [];
	public loading: any;

	constructor(
		private userService: UserService,
		private authService: AuthenticationService,
		private route: Router,
		private alertCtrl: AlertController,
		private loadingCtrl: LoadingController
	) {
		
		 //calls the getUsers method from the user service
		   // to get all the registered users
		 
		this.userService.getUsers().subscribe(userData => {
			this.userList = userData;
		}, error=>{
			this.alert(error.message);
		});
	}

	ngOnInit() { }

	//updates the user status of the selected user
	async updateUserStatus(status: string, id: string) {
		const alert = await this.alertCtrl.create({
			message: "Are you sure you want to " + status + " the user?",
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Yes',
					handler: async data => {
						this.loading = await this.loadingCtrl.create();
						await this.loading.present();
						this.userService.updateUserStatus(status, id).then(async () => {
							this.loading.dismiss().then(async () => {
								this.alert('User is now ' + status);
							});
						}, error => {
							this.alert(error.message);
						});
					}
				}]
		})
		await alert.present();
	}

	//updates the role of the selected user
	async updateUserRole(role: string, id: string) {
		const alert = await this.alertCtrl.create({
			message: "Are you sure you want to update the User Role to " + role + "?",
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Yes',
					handler: async data => {
						this.loading = await this.loadingCtrl.create();
						await this.loading.present();
						this.userService.updateUserRole(role, id).then(async () => {
							this.loading.dismiss().then(async () => {
								this.alert('User is now ' + role);
							});
						}, error => {
							this.alert(error.message);
						});
					}
				}]
		})
		await alert.present();
	}

	//alert method
	async alert(msg) {
		const alert = await this.alertCtrl.create({
			message: msg,
			buttons: [{ text: "OK", role: "cancel" }]
		});
		await alert.present();
	}

	//allows to delete the selected user
	async deleteUser(id: string) {
		const alert = await this.alertCtrl.create({
			message: "Are you sure you want to delete the User?",
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Yes',
					handler: async data => {
						this.loading = await this.loadingCtrl.create();
						await this.loading.present();
						this.userService.deleteUser(id).then(async () => {
							this.loading.dismiss().then(async () => {
								this.alert('User Deleted!');
							});
						}, error => {
							this.alert(error.message);
						});
					}
				}]
		})
		await alert.present();
	}
}
