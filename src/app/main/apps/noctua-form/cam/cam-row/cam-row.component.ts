import { Component, OnInit, OnDestroy, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/internal/operators';
import * as _ from 'lodash';

import { AnnotonNode } from '@noctua.form/models/annoton/annoton-node';
import { Cam } from '@noctua.form/models/annoton/cam';
import { CamRow } from '@noctua.form/models/cam-row';
import { MatTableDataSource, MatSort } from '@angular/material';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { NoctuaGraphService } from '@noctua.form/services/graph.service';
import { NoctuaLookupService } from '@noctua.form/services/lookup.service';
import { SummaryGridService } from '@noctua.form/services/summary-grid.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';

import { NoctuaFormDialogService } from './../../dialog.service';
import { NoctuaFormService } from '../../services/noctua-form.service';

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
    private noctuaFormService: NoctuaFormService,
    private noctuaFormDialogService: NoctuaFormDialogService,
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
    this.cam.destNode.setTerm({ id: destCam.term })
    this.noctuaGraphService.edit(this.cam.graph, this.cam.srcNode, this.cam.destNode);
  }

  createCamForm() {
    return new FormGroup({
      annotatedEntity: new FormControl(this.cam.annotatedEntity ? this.cam.annotatedEntity.id : ''),
      term: new FormControl(this.cam.destNode ? this.cam.destNode.term.control.value.label : ''),
      evidenceFormArray: this.formBuilder.array(this.createFormEvidence())
    });
  }

  createFormEvidence(): FormGroup[] {
    const self = this;
    let evidenceGroup: FormGroup[] = [];

    if (self.cam.destNode) {
      _.each(self.cam.destNode.evidence, function (evidence) {
        evidenceGroup.push(self.formBuilder.group({
          evidence: new FormControl(evidence.evidence.control.value.label),
          reference: new FormControl(evidence.reference.control.value),
          with: new FormControl(evidence.with.control.value),
        }));
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

  close() {
    this.noctuaFormService.closeRightDrawer();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
