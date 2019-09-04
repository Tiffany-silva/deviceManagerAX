/**
 * reset-password.page.ts
 * @Author: Tiffany Silva
 * @Date: 04/09/2019
 * @Description: This represents the reset password page
 *      that allows the user to reset the password if forgotten.
 */

import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.page.html',
	styleUrls: ['./reset-password.page.scss'],
})

export class ResetPasswordPage implements OnInit {
	public resetPasswordform: FormGroup;
	public loading: HTMLIonLoadingElement;

	constructor(
		public alertCtrl: AlertController,
		private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private router: Router
	) {
		//initializes the validators for the form fields
		this.resetPasswordform = this.formBuilder.group({
			'email': [
				'',
				Validators.compose([
					Validators.required,
					Validators.email
				]),
			],
		});
	}

	ngOnInit() {}

	//allows to reset the password of the user with the provided email
	async resetPassword(resetPasswordForm: FormGroup) {
		if (!resetPasswordForm.valid) {
			const alert = await this.alertCtrl.create({
				message: 'email not entered',
				buttons: [{ text: 'Ok', role: 'cancel' }],
			});
			await alert.present();
		} else {
			const email: string = resetPasswordForm.value.email;
			this.authService.resetPassword(email).then(
				async () => {
					const alert = await this.alertCtrl.create({
						message: 'Check your email for a password reset link',
						buttons: [
							{
								text: 'Ok',
								role: 'cancel',
								handler: () => {
									this.router.navigateByUrl('login');
								},
							},
						],
					});
					await alert.present();
				},
				async error => {
					const errorAlert = await this.alertCtrl.create({
						message: error.message,
						buttons: [{ text: 'Ok', role: 'cancel' }],
					});
					await errorAlert.present();
				}
			);
		}
	}
}
