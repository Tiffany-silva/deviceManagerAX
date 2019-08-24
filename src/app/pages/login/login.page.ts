import { AuthenticationService } from 'src/app/services/authentication.service';

import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NavController, LoadingController, AlertController} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  errorMessage: string = '';
  public loading: HTMLIonLoadingElement;
=
    constructor(
      public loadingCtrl: LoadingController,
      public alertCtrl: AlertController,
      private authService: AuthenticationService,
      private router: Router,
      private formBuilder: FormBuilder
    ) {
      this.loginForm = this.formBuilder.group({
        email: ['',
          Validators.compose([Validators.required, Validators.email])],
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(6)]),
        ],
      });
    }

  ngOnInit() {

    this.loginForm=this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('',Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });

  }
  
  validation_messages={
    'email':[
      {type: 'required', message: 'Email is required'},
      {type: 'pattern', message: 'Please enter a valid email'}
    ],
    'password':[
      {type: 'required', message: 'Password is required'},
      {type: 'minlength', message: 'Password must be atleast 5 characters long'}
    ]
  };

  async loginUser(loginForm: FormGroup): Promise<void> {
    if (!loginForm.valid) {
      console.log('Form is not valid yet, current value:', loginForm.value);
    } else {
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();
  
      const email = loginForm.value.email;
      const password = loginForm.value.password;
  
      this.authService.loginUser(email, password).then(
        () => {
          this.loading.dismiss().then(() => {
            this.router.navigateByUrl('home');
          });
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
