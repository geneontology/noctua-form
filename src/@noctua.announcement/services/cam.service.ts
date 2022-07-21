import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NoctuaAnnouncementService {

  onAnnouncementChanged: BehaviorSubject<any>;

  constructor(
    private httpClient: HttpClient) {

    this.onAnnouncementChanged = new BehaviorSubject(null);

  }

  getAnnouncement() {
    return this.httpClient.get(environment.announcementUrl).subscribe((response) => {
      console.log(response)
      this.onAnnouncementChanged.next(response);
    });
  }
}
