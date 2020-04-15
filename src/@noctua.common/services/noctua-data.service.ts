import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoctuaDataService {
  onContributorsChanged: BehaviorSubject<any>;
  onGroupsChanged: BehaviorSubject<any>;
  onOrganismsChanged: BehaviorSubject<any>;

  constructor() {
    this.onContributorsChanged = new BehaviorSubject([]);
    this.onGroupsChanged = new BehaviorSubject([]);
    this.onOrganismsChanged = new BehaviorSubject([]);
  }

}
