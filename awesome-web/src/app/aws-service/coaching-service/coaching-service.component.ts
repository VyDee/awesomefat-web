import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { CoachingService } from './../../shared/product-info';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coaching-service',
  templateUrl: './coaching-service.component.html',
  styleUrls: ['./coaching-service.component.scss']
})
export class CoachingServiceComponent implements OnInit {
  coachingServiceCollection: AngularFirestoreCollection<CoachingService>;
  coachingService: Observable<CoachingService[]>;

  coachingServiceArr = [];

  constructor(
    private afs: AngularFirestore
  ) {
    this.coachingServiceCollection = this.afs.collection<CoachingService>('coaching-service');
    this.coachingService = this.coachingServiceCollection.valueChanges();
  }

  ngOnInit(): void {
    this.getCoachingServices().subscribe((services) => {
      this.coachingServiceArr = services;
      console.log(this.coachingServiceArr);
    })
  }

  getCoachingServices() {
    return this.coachingService;
  }

}
