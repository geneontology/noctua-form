import { Component, Inject, OnInit, ElementRef, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, Subscription, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { noctuaAnimations } from '@noctua/animations';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';

import { takeUntil } from 'rxjs/internal/operators';
import { forEach } from '@angular/router/src/utils/collection';

import { NoctuaFormService } from '../../services/noctua-form.service';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { NoctuaFormGridService } from '@noctua.form/services/form-grid.service';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { NoctuaLookupService } from '@noctua.form/services/lookup.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

import { Cam } from '@noctua.form/models/annoton/cam';
import { Annoton } from '@noctua.form/models/annoton/annoton';
import { AnnotonNode } from '@noctua.form/models/annoton/annoton-node';
import { Evidence } from '@noctua.form/models/annoton/evidence';

@Component({
  selector: 'noc-cam-form',
  templateUrl: './cam-form.component.html',
  styleUrls: ['./cam-form.component.scss'],
})

export class CamFormComponent implements OnInit, OnDestroy {
  camForm: FormGroup;
  camFormSub: Subscription;

  searchCriteria: any = {};
  camFormPresentation: any;
  //camForm: FormGroup;
  evidenceFormArray: FormArray;
  camFormData: any = []
  annoton: Annoton = new Annoton();

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private noctuaSearchService: NoctuaSearchService,
    private noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaFormGridService: NoctuaFormGridService,
    private noctuaLookupService: NoctuaLookupService,
    public noctuaFormService: NoctuaFormService,
    private sparqlService: SparqlService,
    private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
    this.unsubscribeAll = new Subject();

    //this.noctuaFormGridService.initalizeForm();

    // this.createNoctuaForm();


    this.annoton = this.noctuaFormGridService.annoton;
    this.camFormPresentation = this.noctuaFormGridService.annotonPresentation;
  }

  ngOnInit(): void {
    this.camFormSub = this.noctuaFormGridService.camForm$
      .subscribe(camForm => {
        if (!camForm) return;
        this.camForm = camForm;
      })
  }

  save() {
    let destForm = this.camForm.value;

    console.dir(destForm)
    //  this.noctuaSearchService.search(destForm);
  }

  clear() {

  }

  createNoctuaForm() {
    const self = this;

    self.camForm = new FormGroup({
      title: new FormControl(),
      state: new FormControl(),
      group: new FormControl(),
      gp: new FormControl(),
      fd: this.formBuilder.group({})
    });

    self.annoton = self.noctuaFormGridService.annoton;
    self.camFormPresentation = self.noctuaFormGridService.annotonPresentation;
    self.addFdForm(self.camForm.controls['fd'] as FormGroup);
    self.camFormData = self.noctuaFormConfigService.createReviewSearchFormData();
    self.onValueChanges();
  }

  addFdForm(camFdFormGroup: FormGroup) {
    const self = this;

    each(self.camFormPresentation.fd, (nodeGroup, nodeKey) => {
      camFdFormGroup.addControl(nodeKey, this.formBuilder.group({}))

      let nodeFormGroup: FormGroup = camFdFormGroup.controls[nodeKey] as FormGroup;

      each(nodeGroup.nodes, (entity, entityKey) => {
        nodeFormGroup.addControl(entity.id, new FormGroup({}))
      });
    });
  }

  createExample() {
    const self = this;

    self.noctuaFormGridService.initalizeFormData();
    // self.createNoctuaForm();
  }

  changeAnnotonTypeForm(annotonType) {
    const self = this;

    self.noctuaFormGridService.setAnnotonType(this.noctuaFormGridService.annoton, annotonType.name);
    // self.createNoctuaForm();
  }

  changeAnnotonModelTypeForm(annotonModelType) {
    const self = this;

    self.noctuaFormGridService.setAnnotonModelType(this.noctuaFormGridService.annoton, annotonModelType.name);
    //  self.createNoctuaForm();
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

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  close() {
    this.noctuaFormService.closeLeftDrawer();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
