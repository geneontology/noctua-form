import { Component, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import {
  Cam,
  NoctuaUserService,
  NoctuaFormConfigService,
  CamService,
  NoctuaFormMenuService,
  LeftPanel
} from '@geneontology/noctua-form-base';
import { NoctuaSearchMenuService } from '@noctua.search/services/search-menu.service';
import { NoctuaFormDialogService } from '../../services/dialog.service';


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
  camForm: FormGroup;

  duplicatedCam;

  private _unsubscribeAll: Subject<any>;

  constructor(public noctuaUserService: NoctuaUserService,
    private ngZone: NgZone,
    private camService: CamService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaSearchMenuService: NoctuaSearchMenuService,
    public noctuaFormMenuService: NoctuaFormMenuService
  ) {
    this._unsubscribeAll = new Subject();
    // this.activity = self.noctuaCamFormService.activity;
    //  this.camFormPresentation = this.noctuaCamFormService.activityPresentation;
  }

  ngOnInit(): void {
    this.camForm = this.createCamForm();
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

  ngOnDestroy(): void {
    this.camService.onCopyModelChanged.next(null)
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  createCamForm() {
    return new FormGroup({
      title: new FormControl(),
    });
  }

  copyModel() {

    const self = this;

    const success = (value) => {
      if (value) {
        this.loading = true;
        this.camService.copyModel(this.cam, value?.title);
      } else {
        this.loading = false;
      };
    }

    this.noctuaFormDialogService.openConfirmCopyModelDialog(self.cam, success);
  }

  close() {

    if (this.panelSide === 'left') {
      this.noctuaFormMenuService.selectLeftPanel(LeftPanel.camForm);
    } else if (this.panelSide === 'right') {
      this.noctuaSearchMenuService.selectRightPanel(null);
    }
    this.panelDrawer.close();
  }


}
