import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../service/user-auth.service';

@Component({
  selector: 'my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  constructor(public userAuthService:UserAuthService) { }

  ngOnInit(): void {
  }

}
