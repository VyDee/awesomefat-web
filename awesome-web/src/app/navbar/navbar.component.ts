import { UserAuthService } from './../service/user-auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    public userAuthService:UserAuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onLogOut() {
    this.userAuthService.onLogOut();
    this.router.navigateByUrl('/home');
  }

}
