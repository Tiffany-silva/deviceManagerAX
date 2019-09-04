/**
 * sign-up.page.ts
 * @Author: Tiffany Silva
 * @Date: 04/09/2019
 * @Description: This represents the sign up page that
 *        allows the user to register.
 */

import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './../../interfaces/user';
import { UserService } from './../../services/user/user.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
@Component({
	selector: 'app-signup',
	templateUrl: './signup.page.html',
	styleUrls: ['./signup.page.scss'],
	providers: [AngularFirestore]
})

export class SignupPage implements OnInit {

	public signupForm: FormGroup;
	public errorMessage: string = '';
	public successMessage: string = '';
	public loading: any;

	constructor(
		private authService: AuthenticationService,
		private loadingCtrl: LoadingController,
		private alertCtrl: AlertController,
		private formBuilder: FormBuilder,
		private router: Router,
		private userService: UserService
	) {
		//initializes the validators for the fields of the form
		this.signupForm = this.formBuilder.group({
			firstName: [
				'', Validators.compose([Validators.required]),
			],
			lastName: [
				'', Validators.compose([Validators.required]),
			],
			email: [
				'', Validators.compose([Validators.required, Validators.email]),
			],
			password: [
				'', Validators.compose([Validators.required, Validators.minLength(6)]),
			],
			confirmPassword: [
				'', [Validators.compose([Validators.required])]
			],
		},
			{ validator: this.repeatPasswordValidator }
		);
	}

	ngOnInit() {
	}
	//allows to register a user
	async registerUser(signupForm: FormGroup): Promise<void> {
		if (!signupForm.valid) {
			const alert = await this.alertCtrl.create({
				message: 'Fields not filled!',
				buttons: [{ text: 'OK', role: 'cancel' }],
			});
			await alert.present();
		} else {
			const email: string = signupForm.value.email;
			const firstName: string = signupForm.value.firstName;
			const lastName: string = signupForm.value.lastName;
			const password: string = signupForm.value.password;
			let userid: string = '';
			/**
			 * calls the signup method from the authentication 
			 * service to register a user
			 */
			this.authService.signup(email, password).then(
				async (data) => {
					userid = data.user.uid;
					const user: User = {
						'firstName': firstName,
						'lastName': lastName,
						'email': email,
						'createdDate': new Date(),
						'role': 'borrower',
						'status': 'disabled'
					}
					/**
					 * calls the addUser method from the 
					 * 	user service to register a user
					 */
					this.userService.addUser(user, userid).then(() => {
						this.loading.dismiss().then(async () => {
							const alert = await this.alertCtrl.create({
								message: 'Registration Successful!',
								buttons: [{ text: 'OK', role: 'cancel' }],
							});
							await alert.present();
							this.router.navigateByUrl('login');
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
					
				},
				error => {
					this.loading.dismiss().then(async () => {
						const alert = await this.alertCtrl.create({
							message: error.message,
							buttons: [{ text: 'ok', role: 'cancel' }],
						});
						await alert.present();
					})
				}
			)
			this.loading = await this.loadingCtrl.create();
			await this.loading.present();
		}
	}
	//confirm password validator
	repeatPasswordValidator(c: AbstractControl) {
		const password = (c.get('password')) ? c.get('password').value : null;
		const passwordConfirm = (c.get('confirmPassword')) ? c.get('confirmPassword').value : null;
		return password === passwordConfirm ? null : { passwordsNotEqual: true }
	}
}
