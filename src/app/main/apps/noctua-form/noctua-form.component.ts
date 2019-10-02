import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material';
import { Subject } from 'rxjs';

import { noctuaAnimations } from './../../../../@noctua/animations';

import {
  Cam,
  AnnotonType,
  Contributor,
  NoctuaUserService,
  NoctuaFormConfigService,
  NoctuaGraphService,
  NoctuaAnnotonFormService,
  CamService,
  noctuaFormConfig
} from 'noctua-form-base';

import { NoctuaFormService } from './services/noctua-form.service';
import { takeUntil } from 'rxjs/operators';
import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

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

  constructor(private route: ActivatedRoute,
    private camService: CamService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    public noctuaFormService: NoctuaFormService,
    private sparqlService: SparqlService,
    private noctuaGraphService: NoctuaGraphService, ) {

    this._unsubscribeAll = new Subject();

    this.route
      .queryParams
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.modelId = params['model_id'] || null;
        this.baristaToken = params['barista_token'] || null;
        this.noctuaUserService.baristaToken = this.baristaToken;
        this.noctuaFormConfigService.baristaToken = this.baristaToken;
        this.getUserInfo();
        this.loadCam(this.modelId);
      });
  }

  getUserInfo() {
    const self = this;

    this.noctuaUserService.getUser()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        if (response && response.nickname) {
          this.user = new Contributor()
          this.user.name = response.nickname;
          this.user.groups = response.groups;
          // user.manager.use_groups([self.userInfo.selectedGroup.id]);
          this.noctuaUserService.user = this.user;
          this.noctuaUserService.onUserChanged.next(this.user);
        }
      });
  }

  ngOnInit(): void {
    this.noctuaFormService.setLeftDrawer(this.leftDrawer);
    this.noctuaFormService.setRightDrawer(this.rightDrawer);
    this.sparqlService.getAllContributors()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((contributors: Contributor[]) => {
        this.noctuaUserService.contributors = contributors;
        this.noctuaGraphService.populateContributors(this.cam);
      });
  }


  loadCam(modelId) {
    this.cam = this.camService.getCam(modelId);
  }

  openCamForm() {
    this.camService.initializeForm(this.cam);
    this.noctuaFormService.openLeftDrawer(this.noctuaFormService.panel.camForm);
  }

  openAnnotonForm(annotonType: AnnotonType) {
    this.noctuaAnnotonFormService.setAnnotonType(annotonType);
    this.noctuaFormService.openLeftDrawer(this.noctuaFormService.panel.annotonForm);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

