
import { Component, OnInit, OnDestroy } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import {
  AnnotonNode,
  Evidence,
  NoctuaFormConfigService,
  NoctuaAnnotonFormService
} from 'noctua-form-base';

import { noctuaAnimations } from './../../../../../../@noctua/animations';

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
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
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



