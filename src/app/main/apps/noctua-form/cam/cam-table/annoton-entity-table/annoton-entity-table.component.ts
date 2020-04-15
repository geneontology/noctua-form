import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { noctuaAnimations } from './../../../../../../../@noctua/animations';
import { takeUntil } from 'rxjs/internal/operators';


import { CamTableService } from './../services/cam-table.service';

import {
  NoctuaFormConfigService,
  NoctuaAnnotonEntityService,
  CamService,
  NoctuaFormMenuService
} from 'noctua-form-base';

import {
  Cam,
  Annoton,
  AnnotonNode
} from 'noctua-form-base';


@Component({
  selector: 'noc-annoton-entity-table',
  templateUrl: './annoton-entity-table.component.html',
  styleUrls: ['./annoton-entity-table.component.scss'],
  animations: noctuaAnimations
})
export class AnnotonEntityTableComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'relationship',
    'aspect',
    'term',
    'relationshipExt',
    'extension',
    'evidence',
    'reference',
    'with',
    'assignedBy'];

  grid: any[] = [];

  @Input('cam')
  public cam: Cam

  // @Input('annotonNodes')
  //  public annotonNodes: AnnotonNode[]


  private _unsubscribeAll: Subject<any>;

  constructor(
    private camService: CamService,
    public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public camTableService: CamTableService,
    public noctuaAnnotonEntityService: NoctuaAnnotonEntityService) {

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.cam.onGraphChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((annotons: Annoton[]) => {
        if (annotons) {
          this.cam.applyFilter();
          this.loadCam();
        }
      });
  }

  loadCam() {
    this.grid = this.cam.grid;
  }

  selectEntity(annoton: Annoton, entity: AnnotonNode) {
    this.camService.onCamChanged.next(this.cam);
    this.noctuaAnnotonEntityService.initializeForm(annoton, entity);
    this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.annotonEntityForm);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

