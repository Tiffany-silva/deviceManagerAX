import { NavController,AlertController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {

  public signupForm:FormGroup;
  errorMessage:string='';
  successMessage:string='';
  public loading:any;

  constructor(
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private router: Router

  ) { 
    this.signupForm=this.formBuilder.group({
      // firstname: [
      //   '', Validators.compose([Validators.required]),
      // ],
      // lastname: [
      //   '', Validators.compose([Validators.required]),
      // ],
       email: [
         '', Validators.compose([Validators.required, Validators.email]),
       ],
       password: [
         '', Validators.compose([Validators.required,Validators.minLength(6)]),
       ],
       confirmPassword: [
         '', [Validators.compose([Validators.required])]
      ],
    },
    {validator: this.repeatPasswordValidator}
    );
  }

  ngOnInit() {
  }

  async registerUser(signupForm: FormGroup): Promise<void>{
    if(!signupForm.valid){
      console.log('Need to complete the form, current value: ', signupForm.value);
    }else{
      const email: string= signupForm.value.email;
      // const firstname: string=signupForm.value.firstname;
      // const lastname: string= signupForm.value.lastname;
      const password: string=signupForm.value.password;

      this.authService.signup(email,password).then(
        ()=>{
        this.loading.dismiss().then(()=>{
          this.router.navigateByUrl('home');
        });
        },
        error=>{
          this.loading.dismiss().then(async ()=>{
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{text: 'ok', role: 'cancel'}],
            });
            await alert.present();
          });
        }
      );
      this.loading= await this.loadingCtrl.create();
      await this.loading.present();
    }  
  }

  repeatPasswordValidator(c: AbstractControl){
     const password= (c.get('password')) ? c.get('password').value : null;
    const passwordConfirm=(c.get('confirmPassword')) ? c.get('confirmPassword').value : null;
  
    return password===passwordConfirm?null: {passwordsNotEqual:true}
    // return null;
  }



}
  