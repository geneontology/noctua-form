
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatDrawer } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { noctuaAnimations } from './../../../../../../@noctua/animations';

import { takeUntil, startWith } from 'rxjs/internal/operators';

import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { forEach } from '@angular/router/src/utils/collection';

import { NoctuaTranslationLoaderService } from './../../../../../../@noctua/services/translation-loader.service';
import { NoctuaFormConfigService } from 'noctua-form-base';
import { NoctuaGraphService } from 'noctua-form-base';
import { NoctuaLookupService } from 'noctua-form-base';

import { NoctuaAnnotonFormService } from 'noctua-form-base';

import { NoctuaFormService } from './../../services/noctua-form.service';
import { NoctuaAnnotonConnectorService } from 'noctua-form-base';
import { CamTableService } from './services/cam-table.service';
import { NoctuaFormDialogService } from './../../services/dialog.service';
import { NoctuaSearchService } from './../../../../../../@noctua.search/services/noctua-search.service';
import { CamService } from 'noctua-form-base'


import { Cam } from 'noctua-form-base';
import { Annoton } from 'noctua-form-base';


@Component({
  selector: 'noc-cam-table',
  templateUrl: './cam-table.component.html',
  styleUrls: ['./cam-table.component.scss'],
  animations: noctuaAnimations
})
export class CamTableComponent implements OnInit, OnDestroy {

  searchCriteria: any = {};
  searchFormData: any = []
  searchForm: FormGroup;

  @Input('cam')
  public cam: Cam;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild('filter')
  filter: ElementRef;

  @ViewChild(MatSort)
  sort: MatSort;

  searchResults = [];
  modelId: string = '';

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private camService: CamService,
    public noctuaFormService: NoctuaFormService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaSearchService: NoctuaSearchService,
    private noctuaAnnotonConnectorService: NoctuaAnnotonConnectorService,
    //  public noctuaFormService: NoctuaFormService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    public camTableService: CamTableService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaGraphService: NoctuaGraphService,
  ) {

    this.searchFormData = this.noctuaFormConfigService.createReviewSearchFormData();
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // this.cam
  }

  addAnnoton() {
    // let location = {
    //   x: event.clientX,
    //   y: event.clientY
    //  }
    // console.log(event.clientX + 'px');
    // console.log(event.clientY + 'px');

    this.openForm(location);
  }

  openForm(location?) {
    this.noctuaAnnotonFormService.mfLocation = location;
    this.noctuaAnnotonFormService.initializeForm();
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.annotonForm)
  }

  search() {
    let searchCriteria = this.searchForm.value;
    console.dir(searchCriteria)
    this.noctuaSearchService.search(searchCriteria);
  }

  toggleExpand(annoton: Annoton) {
    annoton.expanded = !annoton.expanded;
  }

  openCamEdit(cam) {
    this.noctuaFormDialogService.openCamRowEdit(cam);
  }

  openAnnotonConnector(annoton: Annoton, connector: Annoton) {
    this.noctuaAnnotonConnectorService.createConnection(annoton.connectionId, connector.connectionId);
    //this.noctuaFormDialogService.openAnnotonConnector(annoton);
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.connectorForm);
  }

  openAnnotonForm(annoton: Annoton) {
    this.noctuaAnnotonFormService.initializeForm(annoton);
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.annotonForm)
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
