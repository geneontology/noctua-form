import { Component, Inject, Input, OnInit, ElementRef, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatDrawer } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, Subscription, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { noctuaAnimations } from './../../../../../../@noctua/animations';


import { NoctuaFormService } from '../../services/noctua-form.service';

import { NoctuaGraphService } from 'noctua-form-base';
import { NoctuaFormConfigService } from 'noctua-form-base';
import { NoctuaLookupService } from 'noctua-form-base';
import { NoctuaSearchService } from './../../../../../../@noctua.search/services/noctua-search.service';
import { CamService } from 'noctua-form-base';
import { CamDiagramService } from './../cam-diagram/services/cam-diagram.service';
import { CamTableService } from './../cam-table/services/cam-table.service';


import { Cam } from 'noctua-form-base';
import { Annoton } from 'noctua-form-base';
import { AnnotonNode } from 'noctua-form-base';
import { Evidence } from 'noctua-form-base';

@Component({
  selector: 'noc-cam-form',
  templateUrl: './cam-form.component.html',
  styleUrls: ['./cam-form.component.scss'],
})

export class CamFormComponent implements OnInit, OnDestroy {

  @Input('panelDrawer')
  panelDrawer: MatDrawer;
  cam: Cam;
  camFormGroup: FormGroup;
  camFormSub: Subscription;

  searchCriteria: any = {};
  camFormPresentation: any;
  //camForm: FormGroup;
  evidenceFormArray: FormArray;
  camFormData: any = []
  // annoton: Annoton = new Annoton();

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private camService: CamService,
    private formBuilder: FormBuilder,
    private noctuaSearchService: NoctuaSearchService,
    private camDiagramService: CamDiagramService,
    public camTableService: CamTableService,
    private noctuaGraphService: NoctuaGraphService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService,
    public noctuaFormService: NoctuaFormService
  ) {
    this.unsubscribeAll = new Subject();
    // this.annoton = self.noctuaCamFormService.annoton;
    //  this.camFormPresentation = this.noctuaCamFormService.annotonPresentation;
  }

  ngOnInit(): void {
    this.camFormSub = this.camService.camFormGroup$
      .subscribe(camFormGroup => {
        if (!camFormGroup) return;
        this.camFormGroup = camFormGroup;

        console.log(this.camFormGroup)
      });

    this.camService.onCamChanged.subscribe((cam) => {
      this.cam = cam

      this.camService.initializeForm(cam);

      this.cam.onGraphChanged.subscribe((annotons) => {
        //console.log("cam changed")
        //  let data = this.summaryGridService.getGrid(annotons);
        //  this.sparqlService.addCamChildren(cam, data);
        //  this.dataSource = new CamsDataSource(this.sparqlService, this.paginator, this.sort);
      });
    });
  }

  save() {
    const self = this;
  }

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  close() {
    this.panelDrawer.close()
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
