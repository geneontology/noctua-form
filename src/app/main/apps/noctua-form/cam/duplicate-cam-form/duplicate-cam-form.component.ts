import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  Cam,
  NoctuaUserService,
  NoctuaFormConfigService,
  NoctuaGraphService,
  CamService,
  Entity,
  NoctuaFormMenuService
} from '@geneontology/noctua-form-base';
import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'noc-duplicate-cam-form',
  templateUrl: './duplicate-cam-form.component.html',
  styleUrls: ['./duplicate-cam-form.component.scss'],
})

export class DuplicateCamFormComponent implements OnInit, OnDestroy {

  @Input('panelDrawer')
  panelDrawer: MatDrawer;
  cam: Cam;
  camFormGroup: FormGroup;
  camFormSub: Subscription;
  camForm
  loading = false;

  duplicatedModelInfo;

  private _unsubscribeAll: Subject<any>;

  constructor(public noctuaUserService: NoctuaUserService,
    private sparqlService: SparqlService,
    private camService: CamService,
    private noctuaGraphService: NoctuaGraphService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaFormMenuService: NoctuaFormMenuService
  ) {
    this._unsubscribeAll = new Subject();
    // this.activity = self.noctuaCamFormService.activity;
    //  this.camFormPresentation = this.noctuaCamFormService.activityPresentation;
  }

  ngOnInit(): void {

    this.camService.onCamChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam) => {
        if (!cam) {
          return;
        }

        this.cam = cam;
        this.camForm = this.createForm();
      });
  }

  createForm() {
    return new FormGroup({
      title: new FormControl(this.cam.title + ' Copy'),
    });
  }


  duplicate() {
    const self = this;
    const value = this.camForm.value;
    self.loading = true;

    this.camService.duplicateModel(self.cam, value.title).then(response => {
      self.duplicatedModelInfo = self.noctuaFormConfigService.getModelUrls(response.data().id)
      self.loading = false;
    }, error => {
      console.log(error)
      self.loading = false;
    })
  }


  close() {
    this.panelDrawer.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
