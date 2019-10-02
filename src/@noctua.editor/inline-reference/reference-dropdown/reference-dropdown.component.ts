import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import {
  NoctuaFormConfigService,
  NoctuaAnnotonFormService,
  AnnotonError,
  noctuaFormConfig,
  Article
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
  articles: Article[] = [];
  article: Article;

  private _unsubscribeAll: Subject<any>;

  constructor(public dialogRef: ReferenceDropdownOverlayRef,
    @Inject(referenceDropdownData) public data: any,
    private sparqlService: SparqlService,
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
      debounceTime(400)
    ).subscribe(data => {
      console.log(data);
      self.article = null;
      self.articles = [];
      self._updateArticle(data);
    });
  }

  close() {
    this.dialogRef.close();
  }

  private _updateArticle(value) {
    const self = this;

    if (value.db.name === noctuaFormConfig.evidenceDB.options.pmid.name && value.accession) {
      this.sparqlService.getPubmedInfo(value.accession).pipe(
        takeUntil(this._unsubscribeAll))
        .subscribe((articles: Article[]) => {
          self.articles = articles;
          if (articles && articles.length > 0) {
            self.article = articles[0];
          }
          console.log(articles);
        });
    }
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
