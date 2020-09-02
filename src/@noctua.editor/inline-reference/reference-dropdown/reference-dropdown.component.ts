import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import {
  NoctuaFormConfigService,
  NoctuaAnnotonFormService,
  AnnotonError,
  noctuaFormConfig,
  Article,
  NoctuaLookupService
} from 'noctua-form-base';

import { referenceDropdownData } from './reference-dropdown.tokens';
import { ReferenceDropdownOverlayRef } from './reference-dropdown-ref';
import { NoctuaFormDialogService } from 'app/main/apps/noctua-form';
import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'noc-reference-dropdown',
  templateUrl: './reference-dropdown.component.html',
  styleUrls: ['./reference-dropdown.component.scss']
})

export class NoctuaReferenceDropdownComponent implements OnInit, OnDestroy {
  evidenceDBForm: FormGroup;
  formControl: FormControl;
  article: Article;

  private _unsubscribeAll: Subject<any>;

  constructor(public dialogRef: ReferenceDropdownOverlayRef,
    @Inject(referenceDropdownData) public data: any,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
  ) {
    this._unsubscribeAll = new Subject();
    this.formControl = data.formControl;
  }

  ngOnInit(): void {
    this.evidenceDBForm = this._createEvidenceDBForm();
    this._onValueChange();
  }

  clearValues() {

  }

  save() {
    const self = this;
    const db = this.evidenceDBForm.value.db;
    const accession = this.evidenceDBForm.value.accession;
    const errors = [];
    let canSave = true;

    if (accession.trim() === '') {
      const error = new AnnotonError('error', 1, `${db.name} accession is required`);
      errors.push(error);
      self.noctuaFormDialogService.openAnnotonErrorsDialog(errors);
      canSave = false;
    }

    if (canSave) {
      this.formControl.setValue(db.name + ':' + accession.trim());
      this.close();
    }
  }

  cancelEvidenceDb() {
    this.evidenceDBForm.controls['accession'].setValue('');
  }

  private _createEvidenceDBForm() {
    return new FormGroup({
      db: new FormControl(this.noctuaFormConfigService.evidenceDBs.selected),
      accession: new FormControl('',
        [
          Validators.required,
        ])
    });
  }

  private _onValueChange() {
    const self = this;

    self.evidenceDBForm.valueChanges.pipe(
      takeUntil(this._unsubscribeAll),
      distinctUntilChanged(),
      debounceTime(1000)
    ).subscribe(data => {
      self.article = null;
      self._updateArticle(data);
    });
  }

  close() {
    this.dialogRef.close();
  }

  private _updateArticle(value) {
    const self = this;

    if (value.db.name === noctuaFormConfig.evidenceDB.options.pmid.name && value.accession) {
      const pmid = value.accession.trim();

      if (pmid === '') {
        return;
      }
      this.noctuaLookupService.getPubmedInfo(pmid).pipe(
        takeUntil(this._unsubscribeAll))
        .subscribe((article: Article) => {
          self.article = article;
        });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
