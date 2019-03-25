
import { Component, OnInit, OnDestroy, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { Cam } from 'noctua-form-base';
import { MatTableDataSource, MatSort } from '@angular/material';

import { NoctuaFormConfigService } from 'noctua-form-base';
import { NoctuaGraphService } from 'noctua-form-base';
import { NoctuaLookupService } from 'noctua-form-base';

import { NoctuaSearchService } from './../../../../../../@noctua.search/services/noctua-search.service';

import { SparqlService } from './../../../../../../@noctua.sparql/services/sparql/sparql.service';
@Component({
  selector: 'app-add-evidence',
  templateUrl: './add-evidence.component.html',
  styleUrls: ['./add-evidence.component.scss']
})
export class AddEvidenceDialogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  searchForm: FormGroup;
  searchFormData: any = {};
  cam: any = {};

  constructor(
    private _matDialogRef: MatDialogRef<AddEvidenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _matDialog: MatDialog,
    private route: ActivatedRoute,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaSearchService: NoctuaSearchService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaGraphService: NoctuaGraphService,
    private sparqlService: SparqlService,
  ) {
    this._unsubscribeAll = new Subject();

    this.searchFormData = this.noctuaFormConfigService.createReviewSearchFormData();
    this.cam = this._data.cam
    this.searchForm = this.createAnswerForm();
  }

  ngOnInit() {
    console.log(this.cam)
  }

  close() {
    this._matDialogRef.close();
  }

  createAnswerForm() {
    return new FormGroup({
      annotatedEntity: new FormControl(this.cam.annotatedEntity.id),
      term: new FormControl(this.cam.term.id),
      evidence: new FormControl(this.cam.evidence.id),
      reference: new FormControl(this.cam.reference.label),
      with: new FormControl(this.cam.with),
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}

