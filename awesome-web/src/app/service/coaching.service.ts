import { filter } from 'rxjs/operators';

import { CoachingServiceInterface } from './../shared/product-info';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoachingService {
  coachingServiceCollection: AngularFirestoreCollection<CoachingServiceInterface>;
  coachingService: Observable<CoachingServiceInterface[]>;

  coachingServiceArray : CoachingServiceInterface[]

  constructor(
    private afs: AngularFirestore
  ) {
    this.coachingServiceCollection = this.afs.collection<CoachingServiceInterface>('coaching-service');
    this.coachingService = this.coachingServiceCollection.valueChanges();
  }

  getCoachingServices(): Observable<CoachingServiceInterface[]> {
    return this.coachingService;
  }

  // getCoachingService(id: number): Observable<CoachingServiceInterface> {
  //   this.getCoachingServices().subscribe((services) => {
  //     console.log(">>>services ", services)
  //     const item = services.filter(x => x.id === id);
  //     console.log("filtered item ", item);
  //     console.log(item[0]);
  //     return item[0];

  // });
//}
}
