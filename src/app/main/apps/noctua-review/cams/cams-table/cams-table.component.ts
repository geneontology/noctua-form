import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatDrawer } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { noctuaAnimations } from '@noctua/animations';

import { takeUntil, startWith } from 'rxjs/internal/operators';

import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";


import { ReviewService } from './../../services/review.service';
import { ReviewDialogService } from './../../services/review-dialog.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

import {
  NoctuaGraphService,
  NoctuaFormConfigService,
  NoctuaLookupService,
  CamService,
  noctuaFormConfig
} from 'noctua-form-base';

import {
  Cam,
  Annoton,
  AnnotonNode
} from 'noctua-form-base';
import { NoctuaFormService } from './../../../noctua-form/services/noctua-form.service';



@Component({
  selector: 'noc-cams-table',
  templateUrl: './cams-table.component.html',
  styleUrls: ['./cams-table.component.scss'],
  animations: noctuaAnimations
})
export class CamsTableComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;

  searchCriteria: any = {};
  searchFormData: any = []
  searchForm: FormGroup;
  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  }

  cams: any[] = [];
  searchResults = [];

  constructor(private route: ActivatedRoute,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaSearchService: NoctuaSearchService,
    public reviewService: ReviewService,
    private camService: CamService,
    private noctuaFormService: NoctuaFormService,
    private reviewDialogService: ReviewDialogService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaGraphService: NoctuaGraphService,
    public sparqlService: SparqlService) {

    this.searchFormData = this.noctuaFormConfigService.createSearchFormData();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.noctuaSearchService.onCamsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cams => {
        this.cams = cams;
        this.loadCams();
      });
  }

  toggleLeftDrawer(panel) {
    this.reviewService.toggleLeftDrawer(panel);
  }

  search() {
    let searchCriteria = this.searchForm.value;
    console.dir(searchCriteria)
    this.noctuaSearchService.search(searchCriteria);
  }

  loadCams() {
    this.cams = this.sparqlService.cams;
  }

  toggleExpand(cam: Cam) {
    if (cam.expanded) {
      cam.expanded = false;
    } else {
      cam.expanded = true;
      this.changeCamDisplayView(cam, cam.displayType);
    }
  }

  refresh() {

  }

  openCamForm(cam: Cam) {
    this.sparqlService.getModelMeta(cam.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        if (response && response.length > 0) {
          let responseCam = <Cam>response[0];
          cam.contributors = responseCam.contributors;
          cam.groups = responseCam.groups;
          this.camService.onCamChanged.next(cam);
        }
      });
    this.camService.initializeForm(cam);
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.camForm);
  }

  changeCamDisplayView(cam: Cam, displayType) {
    cam.displayType = displayType;
    this.noctuaGraphService.getGraphInfo(cam, cam.id);
  }

  selectCam(cam: Cam) {
    this.noctuaSearchService.onCamChanged.next(cam);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
