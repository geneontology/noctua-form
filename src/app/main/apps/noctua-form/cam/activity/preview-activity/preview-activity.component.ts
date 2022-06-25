
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import {
  ActivityNode,
  Evidence,
  NoctuaFormConfigService,
  NoctuaActivityFormService,
  Activity
} from '@geneontology/noctua-form-base';
import { noctuaAnimations } from '@noctua/animations';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'noc-preview-activity',
  templateUrl: './preview-activity.component.html',
  styleUrls: ['./preview-activity.component.scss'],
  animations: noctuaAnimations
})
export class PreviewActivityComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;


  @Input('activity')
  activity: Activity;

  constructor(
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.activity.setPreview();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}



