import { Component, Inject, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import {
  NoctuaFormConfigService,
  Entity,
} from '@geneontology/noctua-form-base';


@Component({
  selector: 'noc-term-details',
  templateUrl: './term-detail.component.html',
  styleUrls: ['./term-detail.component.scss']
})

export class NoctuaTermDetailComponent implements OnInit, OnDestroy {

  @Input() termData: any = {}
  evidenceDBForm: FormGroup;
  formControl: FormControl;
  termDetail

  private _unsubscribeAll: Subject<any>;

  constructor(
    public noctuaFormConfigService: NoctuaFormConfigService,
  ) {
    this._unsubscribeAll = new Subject();
    this.formControl = this.termData.formControl;
    this.termDetail = this.termData.termDetail;

  }

  ngOnInit(): void {
  }

  useTerm(term: Entity) {
    this.formControl.setValue(term);
  }

  close() {
    // this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
