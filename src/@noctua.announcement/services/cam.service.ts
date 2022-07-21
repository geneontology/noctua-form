import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Announcement } from "@noctua.announcement/models/announcement";
import { environment } from "environments/environment";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NoctuaAnnouncementService {
  cursor = 0;
  onAnnouncementsChanged: BehaviorSubject<any>;
  onAnnouncementChanged: BehaviorSubject<any>;

  constructor(
    private httpClient: HttpClient) {

    this.onAnnouncementsChanged = new BehaviorSubject(null);
    this.onAnnouncementChanged = new BehaviorSubject(null);

  }

  getAnnouncement() {
    return this.httpClient.get(environment.announcementUrl).subscribe((response: Announcement[]) => {
      if (response) {
        if (response.length > 0) {
          this.onAnnouncementChanged.next(response[this.cursor]);
        }
        this.onAnnouncementsChanged.next(response);
      }
    });
  }
}
