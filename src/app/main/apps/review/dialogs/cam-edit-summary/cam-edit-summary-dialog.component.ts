import { Component, OnInit, OnDestroy, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { Cam } from '@noctua.form/models/annoton/cam';
import { MatTableDataSource, MatSort } from '@angular/material';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { NoctuaGraphService } from '@noctua.form/services/graph.service';
import { NoctuaLookupService } from '@noctua.form/services/lookup.service';
import { SummaryGridService } from '@noctua.form/services/summary-grid.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'cam-edit-summary-dialog',
  templateUrl: './cam-edit-summary-dialog.component.html',
  styleUrls: ['./cam-edit-summary-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CamEditSummaryDialogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  searchForm: FormGroup;
  searchFormData: any = {};
  cam: any = {};

  constructor(
    private _matDialogRef: MatDialogRef<CamEditSummaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _matDialog: MatDialog,
    private route: ActivatedRoute,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaSearchService: NoctuaSearchService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaGraphService: NoctuaGraphService,
    private summaryGridService: SummaryGridService,
    private sparqlService: SparqlService,
    private noctuaTranslationLoader: NoctuaTranslationLoaderService
  ) {
    this._unsubscribeAll = new Subject();

    this.cam = this._data.cam
  }

  ngOnInit() {
    console.log(this.cam)
  }

  close() {
    this._matDialogRef.close();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
