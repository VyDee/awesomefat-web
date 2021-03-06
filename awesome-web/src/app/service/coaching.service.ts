import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { CoachingServiceInterface } from './../shared/product-info';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoachingService {
  coachingServiceCollection: AngularFirestoreCollection<CoachingServiceInterface>;
  coachingService: Observable<CoachingServiceInterface[]>;
  coachingServiceDoc: AngularFirestoreDocument<CoachingServiceInterface>;

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
    })), map((service) =>service.find(x => x.id === id)));
    return service;
  }

  addCoachingService(coachingService) {
    const id = Math.floor(Math.random() * Math.floor(100));
    coachingService.id = id;
    this.coachingServiceCollection.doc(id.toString()).set(coachingService);
  }
  updateCoachingService(coachingService) {
    const id = coachingService.id.toString();
    this.coachingServiceDoc = this.afs.doc(`coaching-service/${id}`);
    this.coachingServiceDoc.update(coachingService);
  }
  deleteCoachingService(coachingServiceId) {
    this.coachingServiceDoc = this.afs.doc(`coaching-service/${coachingServiceId}`);
    this.coachingServiceDoc.delete();
  }
}
