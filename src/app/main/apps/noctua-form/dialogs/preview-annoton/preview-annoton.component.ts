
import { Component, OnInit, OnDestroy, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import {
  AnnotonNode,
  Evidence,
  NoctuaFormConfigService,
  NoctuaGraphService,
  NoctuaLookupService,
  NoctuaAnnotonFormService
} from 'noctua-form-base';

import { noctuaAnimations } from './../../../../../../@noctua/animations';
import { NoctuaSearchService } from './../../../../../../@noctua.search/services/noctua-search.service';
import { SparqlService } from './../../../../../../@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'app-preview-annoton',
  templateUrl: './preview-annoton.component.html',
  styleUrls: ['./preview-annoton.component.scss'],
  animations: noctuaAnimations
})
export class PreviewAnnotonDialogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  evidence: Evidence[] = [];
  annotonNodes: AnnotonNode[] = [];
  selectedAnnotonNode: AnnotonNode;
  searchCriteria: any;
  displayedColumns: string[] = ['select', 'evidence', 'reference', 'with', 'assignedBy'];
  dataSource;
  selection = new SelectionModel<Evidence>(true, []);

  constructor(
    private _matDialogRef: MatDialogRef<PreviewAnnotonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _matDialog: MatDialog,
    private route: ActivatedRoute,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    private noctuaSearchService: NoctuaSearchService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaGraphService: NoctuaGraphService,
    private sparqlService: SparqlService,
  ) {
    this._unsubscribeAll = new Subject();

  }
  ngOnInit() {
    this.preview();
  }

  preview() {
    this.noctuaAnnotonFormService.annoton.setPreview();
  }

  close() {
    this._matDialogRef.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}



