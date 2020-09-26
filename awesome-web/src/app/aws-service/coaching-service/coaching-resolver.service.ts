import { CoachingService } from './../../service/coaching.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CoachingResolverService implements Resolve<any> {

  constructor(
    private coachingService: CoachingService
  ) { }

  resolve(route:ActivatedRouteSnapshot) {
    return this.coachingService.getCoachingServices();
  }
}
