import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';

import { noctuaAnimations } from './../../../../@noctua/animations';

import {
  Cam,
  AnnotonType,
  Contributor,
  NoctuaUserService,
  NoctuaFormConfigService,
  NoctuaFormMenuService,
  NoctuaGraphService,
  NoctuaAnnotonFormService,
  CamService,
  noctuaFormConfig
} from 'noctua-form-base';

import { takeUntil } from 'rxjs/operators';
import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';
import { NoctuaDataService } from '@noctua.common/services/noctua-data.service';

@Component({
  selector: 'app-noctua-form',
  templateUrl: './noctua-form.component.html',
  styleUrls: ['./noctua-form.component.scss'],
  //encapsulation: ViewEncapsulation.None,
  animations: noctuaAnimations
})
export class NoctuaFormComponent implements OnInit, OnDestroy {
  AnnotonType = AnnotonType;

  @ViewChild('leftDrawer', { static: true })
  leftDrawer: MatDrawer;

  @ViewChild('rightDrawer', { static: true })
  rightDrawer: MatDrawer;

  public cam: Cam;
  public user: Contributor;
  searchResults = [];
  modelId = '';
  baristaToken = '';

  noctuaFormConfig = noctuaFormConfig;

  private _unsubscribeAll: Subject<any>;

  constructor
    (private route: ActivatedRoute,
      private camService: CamService,
      private noctuaDataService: NoctuaDataService,
      public noctuaUserService: NoctuaUserService,
      public noctuaFormConfigService: NoctuaFormConfigService,
      public noctuaAnnotonFormService: NoctuaAnnotonFormService,
      public noctuaFormMenuService: NoctuaFormMenuService) {

    this._unsubscribeAll = new Subject();

    this.noctuaDataService.loadContributors();
    this.route
      .queryParams
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.modelId = params['model_id'] || null;
        this.baristaToken = params['barista_token'] || null;
        this.noctuaUserService.baristaToken = this.baristaToken;
        this.noctuaFormConfigService.setUniversalUrls();
        this.getUserInfo();
        this.loadCam(this.modelId);
      });
  }

  getUserInfo() {
    const self = this;

    this.noctuaUserService.getUser()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        if (response && response.token) {
          this.user = new Contributor();
          this.user.name = response.nickname;
          this.user.groups = response.groups;
          // user.manager.use_groups([self.userInfo.selectedGroup.id]);
          this.user.token = response.token;
          this.noctuaUserService.user = this.user;
          this.noctuaUserService.onUserChanged.next(this.user);
        } else {
          this.user = null;
          this.noctuaUserService.user = this.user;
          this.noctuaUserService.onUserChanged.next(this.user);
        }
      });
  }

  ngOnInit(): void {
    const self = this;

    self.noctuaFormMenuService.setLeftDrawer(self.leftDrawer);
    self.noctuaFormMenuService.setRightDrawer(self.rightDrawer);
  }


  loadCam(modelId) {
    const self = this;

    self.noctuaDataService.onContributorsChanged.pipe(
      takeUntil(this._unsubscribeAll))
      .subscribe((contributors: Contributor[]) => {
        self.noctuaUserService.contributors = contributors;
        this.cam = this.camService.getCam(modelId);
      });
  }

  openCamForm() {
    this.camService.initializeForm(this.cam);
    this.noctuaFormMenuService.openLeftDrawer(this.noctuaFormMenuService.panel.camForm);
  }

  openAnnotonForm(annotonType: AnnotonType) {
    this.noctuaAnnotonFormService.setAnnotonType(annotonType);
    this.noctuaFormMenuService.openLeftDrawer(this.noctuaFormMenuService.panel.annotonForm);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

