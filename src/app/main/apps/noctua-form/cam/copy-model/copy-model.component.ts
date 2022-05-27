import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  Cam,
  NoctuaUserService,
  NoctuaFormConfigService,
  CamService,
  NoctuaFormMenuService
} from '@geneontology/noctua-form-base';

@Component({
  selector: 'noc-copy-model',
  templateUrl: './copy-model.component.html',
  styleUrls: ['./copy-model.component.scss'],
})

export class CopyModelComponent implements OnInit, OnDestroy {

  @Input('panelDrawer')
  panelDrawer: MatDrawer;
  cam: Cam;
  loading = false;

  duplicatedCam;

  private _unsubscribeAll: Subject<any>;

  constructor(public noctuaUserService: NoctuaUserService,
    private camService: CamService,
    public noctuaFormConfigService: NoctuaFormConfigService,
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
        if (!cam) {
          return;
        }

        setTimeout(() => {
          this.duplicatedCam = cam
        }, 100)
      });
  }

  copyModel() {
    this.loading = true;
    this.camService.copyModel(this.cam);
  }

  close() {
    this.panelDrawer.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
