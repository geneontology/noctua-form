
import { Component, OnInit, OnDestroy } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import {
  ActivityNode,
  Evidence,
  NoctuaFormConfigService,
  NoctuaActivityFormService
} from 'noctua-form-base';

import { noctuaAnimations } from './../../../../../../@noctua/animations';

@Component({
  selector: 'app-preview-activity',
  templateUrl: './preview-activity.component.html',
  styleUrls: ['./preview-activity.component.scss'],
  animations: noctuaAnimations
})
export class PreviewActivityDialogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  evidence: Evidence[] = [];
  activityNodes: ActivityNode[] = [];
  selectedActivityNode: ActivityNode;
  searchCriteria: any;
  displayedColumns: string[] = ['select', 'evidence', 'reference', 'with', 'assignedBy'];
  dataSource;
  selection = new SelectionModel<Evidence>(true, []);

  constructor(
    private _matDialogRef: MatDialogRef<PreviewActivityDialogComponent>,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
  ) {
    this._unsubscribeAll = new Subject();

  }
  ngOnInit() {
    this.preview();
  }

  preview() {
    this.noctuaActivityFormService.activity.setPreview();
  }

  close() {
    this._matDialogRef.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}



