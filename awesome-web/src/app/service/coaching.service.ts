import { filter, map } from 'rxjs/operators';

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

  coachingServiceArray: CoachingServiceInterface[];

  constructor(
    private afs: AngularFirestore
  ) {
    this.coachingServiceCollection = this.afs.collection<CoachingServiceInterface>('coaching-service');
    this.coachingService = this.coachingServiceCollection.valueChanges();
  }

  getCoachingServices() {
    return this.coachingService;
  }

  getCoachingService(id: number): Observable<any>{
    const service = this.coachingServiceCollection.snapshotChanges()
    .pipe( map(actions => actions.map(a => {
      const data = a.payload.doc.data() as CoachingServiceInterface;
      const id = a.payload.doc.id;
      return { id, ...data };
    })), map((service) => {return service.find(x => x.id === id)}));
    return service;
  }
}
