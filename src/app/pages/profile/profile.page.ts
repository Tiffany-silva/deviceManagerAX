import { UserService } from "src/app/services/user/user.service";
import { Component, OnInit } from "@angular/core";
import { AlertController, LoadingController } from "@ionic/angular";
import { AuthenticationService } from "src/app/services/user/authentication.service";
import { Router, ActivatedRoute } from "@angular/router";
import { last } from "rxjs/operators";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  private id: string;
  public user: any;
  public isEditable = false;
  public loading: any;
  constructor(
    private alertCtrl: AlertController,
    private authService: AuthenticationService,
    private userService: UserService,
    private router: ActivatedRoute,
    private route: Router,
    private loadingCtrl: LoadingController
  ) {
    console.log((this.id = this.router.snapshot.paramMap.get("id")));

    this.user = this.userService.getUserD(this.id).valueChanges();
  }

  ngOnInit() {}

  editbtn() {
    this.isEditable = !this.isEditable;
  }

  logOut(): void {
    this.authService.logoutUser().then(() => {
      this.route.navigateByUrl("login");
    });
  }

  async updateNameAlert(): Promise<void> {
    const alert = await this.alertCtrl.create({
      subHeader: "Your first name & last name",
      inputs: [
        {
          type: "text",
          name: "firstName",
          placeholder: "Your first name",
          value: this.user.firstName
        },
        {
          type: "text",
          name: "lastName",
          placeholder: "Your last name",
          value: this.user.lastName
        }
      ],
      buttons: [
        { text: "Cancel", role: "cancel" },
        {
          text: "Save",
          handler: data => {
            this.updateFullname(data.firstName, data.lastName);
          }
        }
      ]
    });
  
    await alert.present();
  }

  async updateFullname(firstName: string, lastName: string) {
    const alert = await this.alertCtrl.create({
      
      message: "Are you sure you want to change your name?",
      buttons: [
        {
          text: "Yes",
          handler: async data => {
            this.loading = await this.loadingCtrl.create();
              await this.loading.present();
            this.userService.updateName(firstName, lastName).then(async () => {
              this.loading.dismiss().then(async () => {
              const alert = await this.alertCtrl.create({
                  message: "Name changed successfully!",
                  buttons: [{ text: "OK", role: "cancel" }]
                });
                await alert.present();
              })
            },
            error =>{
              this.loading.dismiss().then(async () => {
                const alert = await this.alertCtrl.create({
                  message: error.message,
                  buttons: [{ text: "OK", role: "cancel" }]
                });
                await alert.present();
              });
            });
          }
        },
        { text: "No", role: "cancel" }
      ]
    });
    await alert.present();
  }

  async updateEmailAlert(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { type: 'text', name: 'newEmail', placeholder: 'Your new email' },
        { name: 'password', placeholder: 'Your password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.updateEmail(data.newEmail, data.password);
          },
        },
      ],
    });
    await alert.present();
  }

  async updateEmail(newEmail: string, password: string) {
    const alert = await this.alertCtrl.create({
      
      message: "Are you sure you want to change your Email?",
      buttons: [
        {
          text: "Yes",
          handler: async data => {
            this.loading = await this.loadingCtrl.create();
              await this.loading.present();
              this.userService.updateEmail(newEmail, password).then(async () => {
              this.loading.dismiss().then(async () => {
              const alert = await this.alertCtrl.create({
                  message: "Email updated successfully!",
                  buttons: [{ text: "OK", role: "cancel" }]
                });
                await alert.present();
              })
            },
            error =>{
              this.loading.dismiss().then(async () => {
                const alert = await this.alertCtrl.create({
                  message: error.message,
                  buttons: [{ text: "OK", role: "cancel" }]
                });
                await alert.present();
              });
            });
          }
        },
        { text: "No", role: "cancel" }
      ]
    });
    await alert.present();
  }

  async updatePasswordAlert(): Promise<void> {
      const alert = await this.alertCtrl.create({
        inputs: [
          { name: 'newPassword', placeholder: 'New password', type: 'password' },
          { name: 'oldPassword', placeholder: 'Old password', type: 'password' },
        ],
        buttons: [
          { text: 'Cancel' },
          {
            text: 'Save',
            handler: data => {
              this.updatePassword(data.newPassword, data.oldPassword)
            },
          },
        ],
      });
      await alert.present();
  }

  async updatePassword(newPassword: string, oldPassword: string) {
    const alert = await this.alertCtrl.create({
      
      message: "Are you sure you want to change your Password?",
      buttons: [
        {
          text: "Yes",
          handler: async data => {
            this.loading = await this.loadingCtrl.create();
              await this.loading.present();
              this.userService.updatePassword(newPassword, oldPassword).then(async () => {
              this.loading.dismiss().then(async () => {
              const alert = await this.alertCtrl.create({
                  message: "Password updated successfully!",
                  buttons: [{ text: "OK", role: "cancel" }]
                });
                await alert.present();
              })
            },
            error =>{
              this.loading.dismiss().then(async () => {
                const alert = await this.alertCtrl.create({
                  message: error.message,
                  buttons: [{ text: "OK", role: "cancel" }]
                });
                await alert.present();
              });
            });
          }
        },
        { text: "No", role: "cancel" }
      ]
    });
    await alert.present();
  }

}
