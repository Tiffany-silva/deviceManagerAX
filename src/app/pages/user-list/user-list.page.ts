import { UserService } from "./../../services/user/user.service";
import { Component, OnInit } from "@angular/core";
import { User } from "src/app/interfaces/user";
import { Observable } from "rxjs";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.page.html",
  styleUrls: ["./user-list.page.scss"],
  providers: [BarcodeScanner]
})
export class UserListPage implements OnInit {
  userList: User[] = [];

  constructor(
    private userService: UserService,
    private barcodeScanner: BarcodeScanner,
    private authService:AuthenticationService,
    private route:Router
  ) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(userData => {
      this.userList = userData;
    });
  }

  navProfile(id:string){
   
    this.route.navigate([`../profile/${this.authService.getUserDetails()}`]);
  }

  scan() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        console.log("Barcode data", barcodeData);
      })
      .catch(err => {
        console.log("Error", err);
      });
  }
}
