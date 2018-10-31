import { Component, Inject, OnInit, ElementRef, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { noctuaAnimations } from '@noctua/animations';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';

import { takeUntil } from 'rxjs/internal/operators';
import { forEach } from '@angular/router/src/utils/collection';

import { NoctuaFormService } from '../../services/noctua-form.service';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { NoctuaLookupService } from '@noctua.form/services/lookup.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'noc-cam-form',
  templateUrl: './cam-form.component.html',
  styleUrls: ['./cam-form.component.scss'],
})

export class CamFormComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  camForm: FormGroup;
  evidenceFormArray: FormArray;
  camFormData: any = []
  cams: any[] = [];

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private noctuaSearchService: NoctuaSearchService,
    private noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaFormService: NoctuaFormService,
    private sparqlService: SparqlService,
    private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
    this.camForm = this.createAnswerForm();

    this.unsubscribeAll = new Subject();

    this.camFormData = this.noctuaFormConfigService.createReviewSearchFormData();
    this.onValueChanges();
  }

  ngOnInit(): void {

    this.sparqlService.getAllCurators().subscribe((response: any) => {
      this.camFormData['curator'].searchResults = response;
    });

    this.sparqlService.getAllGroups().subscribe((response: any) => {
      this.camFormData['providedBy'].searchResults = response;
    });

  }

  search() {
    let searchCriteria = this.camForm.value;

    console.dir(searchCriteria)
    this.noctuaSearchService.search(searchCriteria);
  }

  createAnswerForm() {
    return new FormGroup({
      title: new FormControl(),
      state: new FormControl(),
      group: new FormControl(),
      gp: new FormControl(),
      evidenceFormArray: this.formBuilder.array(this.createFormEvidence())
    });
  }

  createFormEvidence(): FormGroup[] {
    const self = this;
    let evidenceGroup: FormGroup[] = [];

    for (let i = 0; i < 9; i++) {
      evidenceGroup.push(this.formBuilder.group({
        term: new FormControl(),
        evidence: new FormControl(),
        reference: new FormControl(),
        with: new FormControl(),
      }));
    }



    return evidenceGroup;
  }

  onValueChanges() {
    const self = this;

    this.camForm.get('gp').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        let searchData = self.camFormData['gp'];
        this.noctuaLookupService.golrTermLookup(data, searchData.id).subscribe(response => {
          self.camFormData['gp'].searchResults = response
        })
      })
  }

  close() {
    this.noctuaFormService.closeLeftDrawer();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
