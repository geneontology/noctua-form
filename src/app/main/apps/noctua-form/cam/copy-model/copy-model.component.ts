import { Component, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  Cam,
  NoctuaUserService,
  NoctuaFormConfigService,
  CamService,
  NoctuaFormMenuService,
  LeftPanel
} from '@geneontology/noctua-form-base';
import { NoctuaSearchMenuService } from '@noctua.search/services/search-menu.service';

@Component({
  selector: 'noc-copy-model',
  templateUrl: './copy-model.component.html',
  styleUrls: ['./copy-model.component.scss'],
})

export class CopyModelComponent implements OnInit, OnDestroy {

  @Input('panelDrawer') panelDrawer: MatDrawer;
  @Input('panelSide') panelSide: string
  cam: Cam;
  loading = false;

  duplicatedCam;

  private _unsubscribeAll: Subject<any>;

  constructor(public noctuaUserService: NoctuaUserService,
    private ngZone: NgZone,
    private camService: CamService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaSearchMenuService: NoctuaSearchMenuService,
    public noctuaFormMenuService: NoctuaFormMenuService
  ) {
    this._unsubscribeAll = new Subject();
    // this.activity = self.noctuaCamFormService.activity;
    //  this.camFormPresentation = this.noctuaCamFormService.activityPresentation;
  }

  ngOnInit(): void {
    this.camService.onCamChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam) => {
        if (!cam) {
          return;
        }

        this.cam = cam;
      });

    this.camService.onCopyModelChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam) => {
        this.loading = false;

        this.ngZone.run(() => {
          console.log('zone ran')
          this.duplicatedCam = cam
        });
      });
  }

  copyModel() {
    this.loading = true;
    this.camService.copyModel(this.cam);
  }

  close() {

    if (this.panelSide === 'left') {
      this.noctuaFormMenuService.selectLeftPanel(LeftPanel.camForm);
    } else if (this.panelSide === 'right') {
      this.noctuaSearchMenuService.selectRightPanel(null);
    }
    this.panelDrawer.close();
  }

  ngOnDestroy(): void {
    this.camService.onCopyModelChanged.next(null)
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
