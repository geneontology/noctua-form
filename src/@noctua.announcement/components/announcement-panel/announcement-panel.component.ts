import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NoctuaSearchMenuService } from '@noctua.search/services/search-menu.service';
import { NoctuaAnnouncementService } from '@noctua.announcement/services/cam.service';
import { Announcement } from '@noctua.announcement/models/announcement';


@Component({
  selector: 'noc-announcement-panel',
  templateUrl: './announcement-panel.component.html',
  styleUrls: ['./announcement-panel.component.scss'],
})

export class AnnouncementPanelComponent implements OnInit, OnDestroy {

  @Input('sidenav') sidenav: MatSidenav;
  announcements: Announcement[];

  private _unsubscribeAll: Subject<any>;

  constructor(
    public noctuaSearchMenuService: NoctuaSearchMenuService,
    private noctuaAnnouncementService: NoctuaAnnouncementService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.noctuaAnnouncementService.onAnnouncementsChanged.pipe(
      takeUntil(this._unsubscribeAll))
      .subscribe((announcements: Announcement[]) => {
        if (announcements) {
          this.announcements = announcements
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  close() {
    this.sidenav.close();
  }


}
