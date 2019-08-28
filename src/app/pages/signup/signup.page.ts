import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './../../interfaces/user';
import { UserService } from './../../services/user/user.service';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/user/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  providers:[AngularFirestore]
})

export class SignupPage implements OnInit {

  public signupForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  public loading: any;

  constructor(
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
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

  async registerUser(signupForm: FormGroup): Promise<void> {
    if (!signupForm.valid) {
      console.log('Need to complete the form, current value: ', signupForm.value);
    } else {
      const email: string = signupForm.value.email;
      const firstName: string=signupForm.value.firstName;
      const lastName: string= signupForm.value.lastName;
      const password: string = signupForm.value.password;

      this.authService.signup(email, password).then(
        (data) => {
          console.log(data);
          const user : User={
            'userid': data.user.uid,
            'firstName': firstName,
            'lastName': lastName,
            'email':email,
            'createdDate': new Date(),
            'role': 'borrower',
            'status': 'disabled'
          }
          this.userService.addUser(user).then(userCreate=>{
            console.log(user);
          })
          this.loading.dismiss().then(async() => {
            const alert= await this.alertCtrl.create({
              message: 'Registration Successful!',
              buttons: [{text: 'OK', role: 'cancel'}],
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
  }

  repeatPasswordValidator(c: AbstractControl) {
    const password = (c.get('password')) ? c.get('password').value : null;
    const passwordConfirm = (c.get('confirmPassword')) ? c.get('confirmPassword').value : null;

    return password === passwordConfirm ? null : { passwordsNotEqual: true }
    // return null;
  }



}
