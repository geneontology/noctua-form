import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { CamTableService } from './../../cam-table/services/cam-table.service';
import { NoctuaFormDialogService } from './../../../services/dialog.service';
import {
  Cam,
  Annoton,
  CamService,
  NoctuaAnnotonFormService,
  NoctuaFormConfigService,
  AnnotonState,
  AnnotonType,
  NoctuaUserService,
  NoctuaFormMenuService,
} from 'noctua-form-base';

@Component({
  selector: 'noc-annoton-form',
  templateUrl: './annoton-form.component.html',
  styleUrls: ['./annoton-form.component.scss'],
})

export class AnnotonFormComponent implements OnInit, OnDestroy {
  AnnotonState = AnnotonState;
  AnnotonType = AnnotonType;

  @Input('panelDrawer')
  panelDrawer: MatDrawer;

  cam: Cam;
  annotonFormGroup: FormGroup;
  annotonFormSub: Subscription;
  molecularEntity: FormGroup;
  searchCriteria: any = {};
  annotonFormPresentation: any;
  evidenceFormArray: FormArray;
  annotonFormData: any = [];
  annoton: Annoton;
  currentAnnoton: Annoton;
  state: AnnotonState;

  private _unsubscribeAll: Subject<any>;

  constructor(private camService: CamService,
    public camTableService: CamTableService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    public noctuaFormMenuService: NoctuaFormMenuService) {
    this._unsubscribeAll = new Subject();

    // this.annoton = self.noctuaAnnotonFormService.annoton;
    // this.annotonFormPresentation = this.noctuaAnnotonFormService.annotonPresentation;
  }

  ngOnInit(): void {
    this.annotonFormSub = this.noctuaAnnotonFormService.annotonFormGroup$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(annotonFormGroup => {
        if (!annotonFormGroup) {
          return;
        }

        this.annotonFormGroup = annotonFormGroup;
        this.currentAnnoton = this.noctuaAnnotonFormService.currentAnnoton;
        this.annoton = this.noctuaAnnotonFormService.annoton;
        this.state = this.noctuaAnnotonFormService.state;
        this.molecularEntity = <FormGroup>this.annotonFormGroup.get('molecularEntity');
      });

    this.camService.onCamChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam) => {
        if (!cam) {
          return;
        }

        this.cam = cam;
        this.cam.onGraphChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
          });
      });
  }

  checkErrors() {
    const errors = this.noctuaAnnotonFormService.annoton.submitErrors;
    this.noctuaFormDialogService.openAnnotonErrorsDialog(errors);
  }

  save() {
    const self = this;

    self.noctuaAnnotonFormService.saveAnnoton().then(() => {
      self.noctuaFormDialogService.openSuccessfulSaveToast('Activity successfully created.', 'OK');
      self.noctuaAnnotonFormService.clearForm();
    });
  }

  preview() {
    this.noctuaFormDialogService.openPreviewAnnotonDialog();
  }

  clear() {
    this.noctuaAnnotonFormService.clearForm();
  }

  createExample() {
    const self = this;

    self.noctuaAnnotonFormService.initializeFormData();
  }

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  close() {
    this.panelDrawer.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
