import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';







import { CamTableService } from './../../cam-table/services/cam-table.service';
import {
  NoctuaFormConfigService,
  NoctuaAnnotonFormService,
  NoctuaAnnotonEntityService,
  CamService,
  NoctuaFormMenuService
} from 'noctua-form-base';

import { Cam } from 'noctua-form-base';
import { Annoton } from 'noctua-form-base';
import { AnnotonNode } from 'noctua-form-base';
import { NoctuaFormDialogService } from '../../../services/dialog.service';


@Component({
  selector: 'noc-annoton-entity-form',
  templateUrl: './annoton-entity-form.component.html',
  styleUrls: ['./annoton-entity-form.component.scss'],
})

export class AnnotonEntityFormComponent implements OnInit, OnDestroy {

  @Input('panelDrawer')
  panelDrawer: MatDrawer;

  annoton: Annoton;
  cam: Cam;
  annotonEntityFormGroup: FormGroup;
  annotonEntityFormSub: Subscription;
  evidenceFormArray: FormArray;
  termNode: AnnotonNode;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private camService: CamService,
    private formBuilder: FormBuilder,
    private noctuaAnnotonEntityService: NoctuaAnnotonEntityService,
    public camTableService: CamTableService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    public noctuaFormMenuService: NoctuaFormMenuService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.annotonEntityFormSub = this.noctuaAnnotonEntityService.entityFormGroup$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(annotonEntityFormGroup => {
        if (!annotonEntityFormGroup) return;
        this.annotonEntityFormGroup = annotonEntityFormGroup;
        this.annoton = this.noctuaAnnotonEntityService.annoton;
        this.termNode = this.noctuaAnnotonEntityService.entity;

      });

    this.camService.onCamChanged.subscribe((cam) => {
      if (!cam) return;

      this.cam = cam
      this.cam.onGraphChanged.subscribe(() => {
        //  let data = this.summaryGridService.getGrid(annotons);
        //  this.dataSource = new CamsDataSource(this.sparqlService, this.paginator, this.sort);
      });
    });
  }

  termDisplayFn(term): string | undefined {
    return term && term.id ? `${term.label} (${term.id})` : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence && evidence.id ? `${evidence.label} (${evidence.id})` : undefined;
  }

  checkErrors() {
    this.noctuaAnnotonEntityService.annoton.enableSubmit();

    let errors = this.noctuaAnnotonFormService.annoton.submitErrors;
    this.noctuaFormDialogService.openAnnotonErrorsDialog(errors)
  }

  save() {
    const self = this;
    self.noctuaAnnotonEntityService.annotonEntityFormToAnnoton();

    //this.noctuaGraphService.edit(this.camService.cam, self.noctuaAnnotonEntityService.termNode).then((data) => {
    //  localStorage.setItem('baristaToken', value);  
    //    self.noctuaFormDialogService.openSuccessfulSaveToast('Activity successfully edited.', 'OK');
    //  });
  }

  /*   openSummary() {
      let destCam = this.camForm.value;
      this.cam.destNode.term=new Entity(destCam.term)
  
      let evidenceArray: Evidence[] = destCam.evidenceFormArray.map((evidence) => {
        let result = new Evidence()
  
        result.uuid = evidence.uuid;
        result.setEvidence(evidence.evidence);
        result.reference=evidence.reference;
        result.with=evidence.with;
  
        return result;
      });
      this.cam.destNode.setEvidence(evidenceArray);
  
      this.reviewDialogService.openCamEditSummary(this.cam);
    } */
  openMoreEvidenceDialog() {

  }

  openSelectEvidenceDialog() {

  }

  addNDEvidence() {

  }
  addEvidence() {
    const self = this;

    let evidenceFormGroup: FormArray = <FormArray>self.annotonEntityFormGroup.get('evidenceFormArray');

    evidenceFormGroup.push(this.formBuilder.group({
      evidence: new FormControl(),
      reference: new FormControl(),
      with: new FormControl(),
    }));
  }

  removeEvidence(index) {
    const self = this;

    let evidenceFormGroup: FormArray = <FormArray>self.annotonEntityFormGroup.get('evidenceFormArray');

    evidenceFormGroup.removeAt(index);
  }

  clear() {
    this.noctuaAnnotonFormService.clearForm();
  }



  close() {
    this.panelDrawer.close()
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
