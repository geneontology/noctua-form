
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


import { NoctuaFormService } from './../../services/noctua-form.service';
import { CamTableService } from './services/cam-table.service';
import { NoctuaFormDialogService } from './../../services/dialog.service';
import { NoctuaSearchService } from './../../../../../../@noctua.search/services/noctua-search.service';

import {
  noctuaFormConfig,
  NoctuaAnnotonConnectorService,
  NoctuaGraphService,
  NoctuaFormConfigService,
  NoctuaAnnotonFormService,
  NoctuaLookupService,
  NoctuaAnnotonEntityService,
  CamService,
  Cam,
  Annoton,
  EntityDefinition,
  AnnotonType
} from 'noctua-form-base';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'noc-cam-table',
  templateUrl: './cam-table.component.html',
  styleUrls: ['./cam-table.component.scss'],
  animations: [
    trigger('annotonExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CamTableComponent implements OnInit, OnDestroy {
  AnnotonType = AnnotonType;
  searchCriteria: any = {};
  searchFormData: any = [];
  searchForm: FormGroup;
  camDisplayTypeOptions = noctuaFormConfig.camDisplayType.options;
  annotonTypeOptions = noctuaFormConfig.annotonType.options;

  @Input('cam')
  public cam: Cam;


  searchResults = [];
  modelId: string = '';

  private _unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    public camService: CamService,
    public noctuaFormService: NoctuaFormService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private confirmDialogService: NoctuaConfirmDialogService,
    private noctuaSearchService: NoctuaSearchService,
    private noctuaAnnotonConnectorService: NoctuaAnnotonConnectorService,
    //  public noctuaFormService: NoctuaFormService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    public camTableService: CamTableService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaGraphService: NoctuaGraphService,
  ) {

    this.searchFormData = this.noctuaFormConfigService.createSearchFormData();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

  }

  addAnnoton() {
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

  expandAll(expand: boolean) {
    this.cam.expandAllAnnotons(expand);
  }

  toggleExpand(annoton: Annoton) {
    annoton.expanded = !annoton.expanded;
  }

  openCamEdit(cam) {
    this.noctuaFormDialogService.openCamRowEdit(cam);
  }

  openAnnotonConnector(annoton: Annoton) {
    this.camService.onCamChanged.next(this.cam);
    this.camService.annoton = annoton;
    this.noctuaAnnotonConnectorService.annoton = annoton;
    this.noctuaAnnotonConnectorService.onAnnotonChanged.next(annoton);
    this.noctuaAnnotonConnectorService.getConnections();
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.connectorForm);
  }

  openAnnotonForm(annoton: Annoton) {
    this.camService.onCamChanged.next(this.cam);
    this.camService.annoton = annoton;
    this.noctuaAnnotonFormService.initializeForm(annoton);
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.annotonForm)
  }

  sortBy(sortCriteria) {
    this.cam.sort = sortCriteria;
  }

  deleteAnnoton(annoton: Annoton) {
    const self = this;

    const success = () => {
      this.camService.deleteAnnoton(annoton).then(() => {
        self.noctuaFormDialogService.openSuccessfulSaveToast('Activity successfully deleted.', 'OK');
      });
    };

    this.confirmDialogService.openConfirmDialog('Confirm Delete?',
      'You are about to delete an activity.',
      success);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
