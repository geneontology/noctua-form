import { Component, OnInit, OnDestroy, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/internal/operators';

declare const require: any;
import * as _ from 'lodash';

const each = require('lodash/forEach');

import { AnnotonNode } from '@noctua.form/annoton/annoton-node';
import { Evidence } from '@noctua.form/annoton/evidence';

import { Cam } from '@noctua.sparql/models/cam';
import { CamRow } from '@noctua.sparql/models/cam-row';
import { MatTableDataSource, MatSort } from '@angular/material';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { NoctuaGraphService } from '@noctua.form/services/graph.service';
import { NoctuaLookupService } from '@noctua.form/services/lookup.service';
import { SummaryGridService } from '@noctua.form/services/summary-grid.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';

import { ReviewDialogService } from './../../dialog.service';
import { ReviewService } from '../../services/review.service';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'noc-cam-row',
  templateUrl: './cam-row.component.html',
  styleUrls: ['./cam-row.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CamRowComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  camForm: FormGroup;
  evidenceFormArray: FormArray;
  camFormData: any = {};
  cam: any = {};
  saveNode: AnnotonNode[] = []

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaSearchService: NoctuaSearchService,
    private reviewService: ReviewService,
    private reviewDialogService: ReviewDialogService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaGraphService: NoctuaGraphService,
    private summaryGridService: SummaryGridService,
    private sparqlService: SparqlService,

    private noctuaTranslationLoader: NoctuaTranslationLoaderService
  ) {
    this._unsubscribeAll = new Subject();
    this.camFormData = this.noctuaFormConfigService.createReviewSearchFormData();
  }

  ngOnInit() {
    this.loadCam();
    this.sparqlService.onCamChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cam => {
        if (cam.model) {
          this.cam = cam;
          console.log(cam)
          this.loadCam();
        }
      });
  }

  loadCam() {
    this.camForm = this.createCamForm();
    this.onValueChanges();
  }

  save() {
    let destCam = this.camForm.value;
    console.log(destCam)
    this.cam.destNode.setTerm(destCam.term)

    let evidenceArray: Evidence[] = destCam.evidenceFormArray.map((evidence) => {
      let result = new Evidence()

      result.individualId = evidence.individualId;
      result.setEvidence(evidence.evidence);
      result.setReference(evidence.reference);
      result.setWith(evidence.with);

      return result;
    });
    this.cam.destNode.setEvidence(evidenceArray);
    this.noctuaGraphService.edit(this.cam.graph, this.cam.srcNode, this.cam.destNode);
  }

  createCamForm() {
    return new FormGroup({
      annotatedEntity: new FormControl(this.cam.annotatedEntity ? this.cam.annotatedEntity.id : ''),
      term: new FormControl(this.cam.destNode ? this.cam.destNode.term.control.value : ''),
      evidenceFormArray: this.formBuilder.array(this.createFormEvidence())
    });
  }

  createFormEvidence(): FormGroup[] {
    const self = this;
    let evidenceGroup: FormGroup[] = [];

    if (self.cam.destNode) {
      _.each(self.cam.destNode.evidence, function (evidence: Evidence) {
        let srcEvidence: FormGroup = new FormGroup({
          evidence: new FormControl(evidence.getEvidence()),
          reference: new FormControl(evidence.getReference()),
          with: new FormControl(evidence.getWith()),
          individualId: new FormControl(evidence.individualId),
        })
        evidenceGroup.push(srcEvidence);

        self.addOnEvidenceValueChanges(srcEvidence)
      });
    } else {
      evidenceGroup.push(this.formBuilder.group({
        evidence: new FormControl(),
        reference: new FormControl(),
        with: new FormControl(),
      }));
    }

    return evidenceGroup;
  }

  onValueChanges() {
    const self = this;

    this.camForm.get('term').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        let searchData = self.camFormData['goTerm'];
        this.noctuaLookupService.golrTermLookup(data, searchData.id).subscribe(response => {
          self.camFormData['goTerm'].searchResults = response
        });
      });
  }

  addOnEvidenceValueChanges(evidence) {
    const self = this;

    evidence.get('evidence').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        let searchData = self.camFormData['evidence'];
        this.noctuaLookupService.golrTermLookup(data, searchData.id).subscribe(response => {
          self.camFormData['evidence'].searchResults = response
        });
      });
  }

  close() {
    this.reviewService.closeRightDrawer();
  }

  addEvidence() {
    const self = this;

    let evidenceFormGroup: FormArray = this.camForm.get('evidenceFormArray') as FormArray;

    evidenceFormGroup.push(this.formBuilder.group({
      evidence: new FormControl(),
      reference: new FormControl(),
      with: new FormControl(),
    }));
  }

  removeEvidence(index) {
    const self = this;

    let evidenceFormGroup: FormArray = <FormArray>this.camForm.get('evidenceFormArray');

    evidenceFormGroup.removeAt(index);
  }

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence ? evidence.label : undefined;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
