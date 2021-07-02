import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { NoctuaUserService, Contributor, Organism, compareOrganism, compareGroup, compareContributor } from 'noctua-form-base';
import { map } from 'rxjs/operators';
import { MatColors } from '@noctua/mat-colors';


@Injectable({
  providedIn: 'root'
})
export class NoctuaDataService {
  baristaUrl = environment.globalBaristaLocation;
  searchApi = environment.searchApi;
  onOrganismsChanged: BehaviorSubject<any>;

  constructor(
    private httpClient: HttpClient,
    private noctuaUserService: NoctuaUserService) {
    this.onOrganismsChanged = new BehaviorSubject([]);

  }

  setup() {
    const self = this;
    const setup$ = forkJoin([this.getUsers(), this.getGroups()]);

    setup$.subscribe((responseList) => {
      if (responseList) {
        self.noctuaUserService.contributors = self.loadContributors(responseList[0]);
        self.noctuaUserService.groups = self.loadGroups(responseList[1]);
        return true;
      } else {
        return false;
      }
    });
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

  getGroups(): Observable<any> {
    const self = this;

    return this.httpClient.get(`${self.baristaUrl}/groups`);
  }

  getOrganisms(): Observable<any> {
    const self = this;

    return this.httpClient.get(`${self.searchApi}/taxa`).pipe(
      map(res => res['taxa'])
    );
  }


  loadContributors(response) {
    const self = this;
    const contributors = response.map((item) => {
      const contributor = new Contributor();

      contributor.name = item.nickname;
      contributor.orcid = item.uri;
      contributor.group = item.group;
      contributor.initials = self.getInitials(item.nickname);
      contributor.color = self.getColor(contributor.initials);

      return contributor;
    });

    return contributors.sort(compareContributor);
  }

  loadGroups(response) {
    const groups = response.map((item) => {
      const group: any = {
        name: item.label,
        url: item.id
      };

      return group;
    });

    return groups.sort(compareGroup);
  }

  loadOrganisms() {
    this.getOrganisms()
      .subscribe((response: any) => {
        if (!response) {
          return;
        }

        const organisms = response.map((item) => {
          const organism: Organism = {
            taxonName: item.label,
            taxonIri: item.id
          };

          return organism;
        });

        this.onOrganismsChanged.next(organisms.sort(compareOrganism));
      });
  }

  private getInitials(string) {
    const names = string.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  private getColor(name: string) {
    const colors = Object.keys(MatColors.all);
    const index = (name.charCodeAt(0) - 65) % (colors.length - 5);
    // console.log(colors)
    if (index && index > 0) {
      return MatColors.getColor(colors[index])[100];
    } else {
      return '##bbc9cc';
    }
  }
}
