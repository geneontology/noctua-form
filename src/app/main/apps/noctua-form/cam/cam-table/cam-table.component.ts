
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';




import { CamTableService } from './services/cam-table.service';
import { NoctuaFormDialogService } from './../../services/dialog.service';

import {
  noctuaFormConfig,
  NoctuaAnnotonConnectorService,
  NoctuaFormConfigService,
  NoctuaAnnotonFormService,
  CamService,
  Cam,
  Annoton,
  AnnotonType,
  NoctuaUserService,
  NoctuaFormMenuService
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

  @Input('options')
  public options: any = {};

  searchResults = [];
  modelId: '';
  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  };

  private _unsubscribeAll: Subject<any>;

  constructor(public camService: CamService,
    public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private confirmDialogService: NoctuaConfirmDialogService,
    private noctuaAnnotonConnectorService: NoctuaAnnotonConnectorService,
    //  public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    public camTableService: CamTableService,
    private noctuaFormDialogService: NoctuaFormDialogService,
  ) {

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    console.log(this.cam)
  }

  addAnnoton() {
    this.openForm(location);
  }

  openForm(location?) {
    this.noctuaAnnotonFormService.mfLocation = location;
    this.noctuaAnnotonFormService.initializeForm();
    this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.annotonForm)
  }

  search() {
    let searchCriteria = this.searchForm.value;
    console.dir(searchCriteria)
    // this.noctuaSearchService.search(searchCriteria);
  }

  expandAll(expand: boolean) {
    this.cam.expandAllAnnotons(expand);
  }

  toggleExpand(annoton: Annoton) {
    annoton.expanded = !annoton.expanded;
  }

  openAnnotonConnector(annoton: Annoton) {
    this.camService.onCamChanged.next(this.cam);
    this.camService.annoton = annoton;
    this.noctuaAnnotonConnectorService.annoton = annoton;
    this.noctuaAnnotonConnectorService.onAnnotonChanged.next(annoton);
    this.noctuaAnnotonConnectorService.getConnections();
    this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.connectorForm);
  }

  openAnnotonForm(annoton: Annoton) {
    this.camService.onCamChanged.next(this.cam);
    this.camService.annoton = annoton;
    this.noctuaAnnotonFormService.initializeForm(annoton);
    this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.annotonForm)
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

    if (!self.noctuaUserService.user) {
      this.confirmDialogService.openConfirmDialog('Not Logged In',
        'Please log in to continue.',
        null);
    } else {
      this.confirmDialogService.openConfirmDialog('Confirm Delete?',
        'You are about to delete an activity.',
        success);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
