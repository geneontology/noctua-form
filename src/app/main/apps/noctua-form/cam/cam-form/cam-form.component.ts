import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
    this.camFormSub = this.camService.camFormGroup$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(camFormGroup => {
        if (!camFormGroup) {
          return;
        }
        this.camFormGroup = camFormGroup;
      });

    this.camService.onCamChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam) => {
        if (!cam) {
          return;
        }

        this.cam = cam;
      });
  }

  save() {

    const value = this.camFormGroup.value;

    const annotations = {
      title: value.title,
      state: value.state.name
    };

    this.noctuaGraphService.saveModelGroup(this.cam, value.group.id);
    this.noctuaGraphService.saveCamAnnotations(this.cam, annotations);
  }

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  close() {
    this.panelDrawer.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
