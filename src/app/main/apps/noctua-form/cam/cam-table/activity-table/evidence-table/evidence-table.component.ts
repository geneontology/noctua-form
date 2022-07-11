
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { noctuaAnimations } from './../../../../../../../../@noctua/animations';


import {
  NoctuaFormConfigService,
  NoctuaActivityEntityService,
  CamService,
  NoctuaFormMenuService,
  Predicate,
  NoctuaUserService,
} from '@geneontology/noctua-form-base';

import {
  Cam,
  Activity,
  ActivityNode
} from '@geneontology/noctua-form-base';
import { EditorCategory } from '@noctua.editor/models/editor-category';
import { SettingsOptions } from '@noctua.common/models/graph-settings';


@Component({
  selector: 'noc-evidence-table',
  templateUrl: './evidence-table.component.html',
  styleUrls: ['./evidence-table.component.scss'],
  animations: noctuaAnimations
})
export class EvidenceTableComponent implements OnInit, OnDestroy {
  EditorCategory = EditorCategory;

  @Input('settings')
  settings: SettingsOptions = new SettingsOptions();

  @Input('options')
  options: any = {};

  @Input('cam')
  public cam: Cam;

  @Input('entity')
  public entity: ActivityNode;

  private unsubscribeAll: Subject<any>;

  constructor(
    public camService: CamService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    //  public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaActivityEntityService: NoctuaActivityEntityService) {

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}

