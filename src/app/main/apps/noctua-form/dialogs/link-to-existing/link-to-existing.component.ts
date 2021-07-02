
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';


import { NoctuaFormConfigService, ActivityNode, Evidence } from 'noctua-form-base';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-link-to-existing',
  templateUrl: './link-to-existing.component.html',
  styleUrls: ['./link-to-existing.component.scss']
})
export class LinkToExistingDialogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  nodes: any[]
  selectedActivityNode;

  constructor(
    private _matDialogRef: MatDialogRef<LinkToExistingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public noctuaFormConfigService: NoctuaFormConfigService,
  ) {
    this._unsubscribeAll = new Subject();

    this.nodes = this._data.nodes;
  }

  ngOnInit() {
  }

  save() {
    this._matDialogRef.close({
      activityNode: this.selectedActivityNode
    });
  }

  close() {
    this._matDialogRef.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
