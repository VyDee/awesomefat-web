import { CoachingService } from './../../service/coaching.service';
import { CoachingServiceInterface } from './../../shared/product-info';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coaching-detail',
  templateUrl: './coaching-detail.component.html',
  styleUrls: ['./coaching-detail.component.scss']
})
export class CoachingDetailComponent implements OnInit {
  service;

  constructor(
    private route: ActivatedRoute,
    private coachingService: CoachingService
  ) { }

  ngOnInit(): void {
    //console.log(+this.route.snapshot.params['id']);
    //this.service = this.coachingService.getCoachingService(+this.route.snapshot.params['id'])
    //console.log("detail component ",this.service);
    this.coachingService.getCoachingServices().subscribe((value) => {
      console.log(value);
      this.service = value.filter(x => x.id === 1);
    });
  }

}
