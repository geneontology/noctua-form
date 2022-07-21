import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contributor } from '../models/contributor';
import { Group } from '../models/group';
import { find } from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class NoctuaUserService {
  private _baristaToken: string;
  baristaUrl = environment.globalBaristaLocation;
  onUserChanged: BehaviorSubject<any>;
  user: Contributor;
  contributors: Contributor[] = [];
  groups: Group[] = [];

  constructor(
    private httpClient: HttpClient
  ) {
    this.onUserChanged = new BehaviorSubject(undefined);
  }

  set baristaToken(value) {
    this._baristaToken = value;
  }

  get baristaToken() {
    return this._baristaToken;
  }

  /* Pass in the barista token, i.e. from the url params */
  getUser(baristaTokenParam?: string) {

    //Check if there is any in the local storage
    const baristaToken = baristaTokenParam ? baristaTokenParam : localStorage.getItem('barista_token');

    if (!baristaToken) {
      //Log them out
      this.baristaToken = null;
      this.user = null;
      this.onUserChanged.next(this.user);
    } else {
      // Check if indeed it is a legit token
      return this.httpClient.get(`${this.baristaUrl}/user_info_by_token/${baristaToken}`)
        .subscribe((response: any) => {
          if (response) {
            if (response.token) {
              //add the token on the local storage           
              this.user = Contributor.fromResponse(response);
              this.user.token = this.baristaToken = response.token;
              localStorage.setItem('barista_token', this.baristaToken);
            } else {
              //log them out
              this.user = null;
              this.baristaToken = null;
              localStorage.removeItem('barista_token');

            }
            this.onUserChanged.next(this.user);
            // remove the token on the url
            const url = new URL(window.location.href);
            url.searchParams.delete('barista_token');
            window.history.replaceState(null, null, url.href);
          }
        });
    }
  }


  getUsers(): Observable<any> {
    const self = this;

    return this.httpClient.get(`${self.baristaUrl}/users`);
  }

  getUserInfo(uri: string): Observable<any> {
    const self = this;

    const encodedUrl = encodeURIComponent(uri);
    return this.httpClient.get(`${self.baristaUrl}/user_info_by_id/${encodedUrl}`);
  }

  getContributorDetails(orcid: string): Contributor {
    const self = this;

    const contributor = find(self.contributors, (inContributor: Contributor) => {
      return inContributor.orcid === orcid;
    });

    return contributor
  }

  getContributorName(orcid: string) {
    const self = this;

    const contributor = find(self.contributors, (inContributor: Contributor) => {
      return inContributor.orcid === orcid;
    });

    return contributor ? contributor.name : orcid;
  }

  getContributorsFromAnnotations(annotations): Contributor[] {
    const self = this;

    const contributors = <Contributor[]>annotations.map((annotation) => {
      const orcid = annotation.value();
      const contributor = self.getContributorDetails(annotation.value())

      if (contributor) {
        return contributor;
      } else {
        const result = new Contributor()
        result.orcid = result.name = orcid

        return result;
      }
    });

    return contributors
  }

  getGroups(): Observable<any> {
    const self = this;

    return this.httpClient.get(`${self.baristaUrl}/groups`);
  }

  getGroupDetails(url: string): Group {
    const self = this;

    const group = find(self.groups, (inGroup: Group) => {
      return inGroup.url === url;
    });

    return group
  }

  getGroupDetailsByName(name: string): Group {
    const self = this;

    const group = find(self.groups, (inGroup: Group) => {
      return inGroup.name === name;
    });

    return group
  }

  getGroupInfo(uri: string): Observable<any> {
    const self = this;

    const encodedUrl = encodeURIComponent(uri);
    return this.httpClient.get(`${self.baristaUrl}/group_info_by_id/${encodedUrl}`);
  }

  getGroupsFromAnnotations(annotations): Group[] {
    const self = this;

    const groups = <Group[]>annotations.map((annotation) => {
      const url = annotation.value();
      const group = self.getGroupDetails(annotation.value())
      return group ? group : new Group(null, url);
    });

    return groups
  }

  getGroupsFromUrls(urls: string[]): Group[] {
    const self = this;

    const groups = <Group[]>urls.map((url) => {
      const group = self.getGroupDetails(url)
      return group ? group : new Group(null, url);
    });

    return groups
  }

  getGroupsFromNames(names: string[]): Group[] {
    const self = this;

    const groups = <Group[]>names.map((name) => {
      const group = self.getGroupDetailsByName(name)
      return group ? group : new Group(null, name);
    });

    return groups
  }


  filterContributors(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.contributors.filter((contributor: Contributor) => contributor.name.toLowerCase().indexOf(filterValue) === 0);
  }

  filterGroups(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.groups.filter((group: Group) => group.name.toLowerCase().indexOf(filterValue) === 0);
  }

  getGroupName(url: string) {
    const self = this;

    const group = find(self.groups, (inGroup: Group) => {
      return inGroup.url === url;
    });

    return group ? group.name : url;
  }

  distinctUser(prev, curr) {
    if (prev && curr) {
      return prev.token === curr.token;
    } else {
      return prev === curr;
    }
  }
}
