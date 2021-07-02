import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { NoctuaFormDialogService } from './../../../services/dialog.service';
import {
  Cam,
  Activity,
  CamService,
  NoctuaActivityFormService,
  NoctuaFormConfigService,
  ActivityState,
  ActivityType,
  NoctuaUserService,
  NoctuaFormMenuService,
} from 'noctua-form-base';

@Component({
  selector: 'noc-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss'],
})

export class ActivityFormComponent implements OnInit, OnDestroy {
  ActivityState = ActivityState;
  ActivityType = ActivityType;

  @Input('panelDrawer')
  panelDrawer: MatDrawer;

  @Input() public closeDialog: () => void;

  cam: Cam;
  activityFormGroup: FormGroup;
  activityFormSub: Subscription;
  molecularEntity: FormGroup;
  searchCriteria: any = {};
  activityFormPresentation: any;
  evidenceFormArray: FormArray;
  activityFormData: any = [];
  activity: Activity;
  currentActivity: Activity;
  state: ActivityState;

  private _unsubscribeAll: Subject<any>;

  constructor(private camService: CamService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    public noctuaFormMenuService: NoctuaFormMenuService) {
    this._unsubscribeAll = new Subject();

    // this.activity = self.noctuaActivityFormService.activity;
    // this.activityFormPresentation = this.noctuaActivityFormService.activityPresentation;
  }

  ngOnInit(): void {
    this.activityFormSub = this.noctuaActivityFormService.activityFormGroup$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(activityFormGroup => {
        if (!activityFormGroup) {
          return;
        }

        this.activityFormGroup = activityFormGroup;
        this.currentActivity = this.noctuaActivityFormService.currentActivity;
        this.activity = this.noctuaActivityFormService.activity;
        this.state = this.noctuaActivityFormService.state;
        this.molecularEntity = <FormGroup>this.activityFormGroup.get('molecularEntity');
      });
  }

  checkErrors() {
    const errors = this.noctuaActivityFormService.activity.submitErrors;
    this.noctuaFormDialogService.openActivityErrorsDialog(errors);
  }

  save() {
    const self = this;

    self.noctuaActivityFormService.saveActivity().then(() => {
      self.noctuaFormDialogService.openInfoToast('Activity successfully created.', 'OK');
      self.noctuaActivityFormService.clearForm();
      if (this.closeDialog) {
        this.closeDialog();
      }
    });
  }

  preview() {
    this.noctuaFormDialogService.openPreviewActivityDialog();
  }

  clear() {
    this.noctuaActivityFormService.clearForm();
  }

  createExample() {
    const self = this;

    self.noctuaActivityFormService.initializeFormData();
  }

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  close() {

    if (this.panelDrawer) {
      this.panelDrawer.close();
    }
    if (this.closeDialog) {
      this.closeDialog();
    }

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
