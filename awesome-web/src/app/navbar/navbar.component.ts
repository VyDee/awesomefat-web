import { UserAuthService } from './../service/user-auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public userAuthService:UserAuthService) { }

  ngOnInit(): void {
  }

  onLogOut() {
    this.userAuthService.onLogOut();
  }

}
