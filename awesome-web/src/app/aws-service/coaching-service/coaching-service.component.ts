import { CoachingService } from './../../service/coaching.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coaching-service',
  templateUrl: './coaching-service.component.html',
  styleUrls: ['./coaching-service.component.scss']
})
export class CoachingServiceComponent implements OnInit {

  coachingServiceArr = [];

  constructor(
    private coachingService: CoachingService
  ) {}

  ngOnInit(): void {
    this.coachingService.getCoachingServices().subscribe((services) => {
      this.coachingServiceArr = services;
    })
  }



}
