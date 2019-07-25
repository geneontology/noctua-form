import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material';
import { Subject } from 'rxjs';

import { noctuaAnimations } from './../../../../@noctua/animations';

import {
  Cam,
  Contributor,
  NoctuaUserService,
  NoctuaFormConfigService,
  NoctuaGraphService,
  NoctuaAnnotonFormService,
  CamService
} from 'noctua-form-base';

import { NoctuaFormService } from './services/noctua-form.service';

@Component({
  selector: 'app-noctua-form',
  templateUrl: './noctua-form.component.html',
  styleUrls: ['./noctua-form.component.scss'],
  //encapsulation: ViewEncapsulation.None,
  animations: noctuaAnimations
})
export class NoctuaFormComponent implements OnInit, OnDestroy {

  @ViewChild('leftDrawer')
  leftDrawer: MatDrawer;

  @ViewChild('rightDrawer')
  rightDrawer: MatDrawer;

  public cam: Cam;
  public user: Contributor;
  searchResults = [];
  modelId: string = '';
  baristaToken: string = '';

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private camService: CamService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    public noctuaFormService: NoctuaFormService,
    private noctuaGraphService: NoctuaGraphService, ) {

    this.unsubscribeAll = new Subject();

    this.route
      .queryParams
      .subscribe(params => {
        this.modelId = params['model_id'] || null;
        this.baristaToken = params['barista_token'] || null;
        this.noctuaUserService.baristaToken = this.baristaToken;
        this.getUserInfo();
        this.loadCam(this.modelId);
      });
  }

  getUserInfo() {
    const self = this;

    this.noctuaUserService.getUser().subscribe((response) => {
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
  }

  loadCam(modelId) {
    this.cam = this.camService.getCam(modelId);
  }


  addAnnoton() {
    this.openAnnotonForm(location);
  }

  openCamForm() {
    //  this.noctuaFormService.initializeForm();
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.camForm)
  }

  openAnnotonForm(location?) {
    this.noctuaAnnotonFormService.initializeForm();
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.annotonForm)
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}

