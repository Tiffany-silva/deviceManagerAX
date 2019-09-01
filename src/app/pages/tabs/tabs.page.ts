import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/user/authentication.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private route:Router, private authService:AuthenticationService) {
    
  }

  navProfile(id:string){
   
    this.route.navigate([`../profile/${this.authService.getUserDetails()}`]);
  }

}
