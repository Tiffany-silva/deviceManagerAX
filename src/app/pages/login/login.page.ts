/**
 * login.page.ts
 * @Author: Tiffany Silva
 * @Date: 04/09/2019
 * @Description: This represents the login page that allows the user
 *      to sign in.
 */

import { UserService } from 'src/app/services/user/user.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

	public loginForm: FormGroup;
	public errorMessage: string = '';
	public loading: HTMLIonLoadingElement;
	private sub: any;
	public status: any;

	constructor(
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		private authService: AuthenticationService,
		private users: UserService,
		private router: Router,
		private formBuilder: FormBuilder
	) {
		//initializes the validators for the fields
		this.loginForm = this.formBuilder.group({
			email: ['',
				Validators.compose([Validators.required, Validators.email])],
			password: [
				'',
				Validators.compose([Validators.required, Validators.minLength(6)]),
			],
		});
	}

	ngOnInit() {}

	//validation messages for the fields
	validation_messages = {
		'email': [
			{ type: 'required', message: 'Email is required' },
			{ type: 'pattern', message: 'Please enter a valid email' }
		],
		'password': [
			{ type: 'required', message: 'Password is required' },
			{ type: 'minlength', message: 'Required atleast 6 characters' }
		]
	};

	//allows the user to log in to the application
	async loginUser(loginForm: FormGroup): Promise<void> {
		if (!loginForm.valid) {
			const alert = await this.alertCtrl.create({
				message: 'Fields not filled',
				buttons: [{ text: 'Ok', role: 'cancel' }],
			});
			await alert.present();
		} else {
			this.loading = await this.loadingCtrl.create();
			await this.loading.present();

			const email = loginForm.value.email;
			const password = loginForm.value.password;

			/**
			 * calls the loginUser method from the authentication service
			 * 		to log the user in.
			 */
			this.authService.loginUser(email, password).then(
				() => {
					//gets the profile of the user
					this.users.getUserP(this.authService.getUserDetails())
						.subscribe((documentSnapshot: firebase.firestore.DocumentSnapshot) => {
							this.sub = documentSnapshot.data();
							this.status = this.sub.status;
							if (this.status == 'enabled') {
								this.loading.dismiss().then(async () => {
									this.router.navigateByUrl('tabs');
								});
							} else if (this.status == 'disabled') {
								this.loading.dismiss().then(async () => {
									const alert = await this.alertCtrl.create({
										message: 'Account not Enabled, Contact Admin',
										buttons: [{ text: 'Ok', role: 'cancel' }],
									});
									await alert.present();
									this.router.navigateByUrl('login');
								})
							}
						})
				},
				error => {
					this.loading.dismiss().then(async () => {
						const alert = await this.alertCtrl.create({
							message: error.message,
							buttons: [{ text: 'Ok', role: 'cancel' }],
						});
						await alert.present();
					});
				}
			);
		}
	}
}
