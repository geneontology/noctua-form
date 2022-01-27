
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
  NoctuaActivityFormService,
} from '@geneontology/noctua-form-base';

import {
  Cam,
  Activity,
  ActivityNode
} from '@geneontology/noctua-form-base';
import { EditorCategory } from '@noctua.editor/models/editor-category';
import { SettingsOptions } from '@noctua.common/models/graph-settings';
import { InlineEditorService } from '@noctua.editor/inline-editor/inline-editor.service';


@Component({
  selector: 'noc-evidence-form-table',
  templateUrl: './evidence-table.component.html',
  styleUrls: ['./evidence-table.component.scss'],
  animations: noctuaAnimations
})
export class EvidenceFormTableComponent implements OnInit, OnDestroy {
  EditorCategory = EditorCategory;

  @Input('settings')
  settings: SettingsOptions = new SettingsOptions();

  @Input('options')
  options: any = {};

  @Input('cam')
  public cam: Cam;

  @Input('activity')
  public activity: Activity;

  @Input('entity')
  public entity: ActivityNode;

  private unsubscribeAll: Subject<any>;
  currentMenuEvent: any = {};

  constructor(
    public camService: CamService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    //  public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    private inlineEditorService: InlineEditorService,
    public noctuaActivityEntityService: NoctuaActivityEntityService) {

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  addEvidence(entity: ActivityNode) {
    const self = this;

    entity.predicate.addEvidence();
    const data = {
      cam: this.cam,
      activity: this.activity,
      entity: entity,
      category: EditorCategory.evidenceAll,
      evidenceIndex: entity.predicate.evidence.length - 1
    };

    this.camService.onCamChanged.next(this.cam);
    this.camService.activity = this.activity;
    this.noctuaActivityEntityService.initializeForm(this.activity, entity);
    this.inlineEditorService.open(this.currentMenuEvent.target, { data });

    self.noctuaActivityFormService.initializeForm();
  }

  removeEvidence(entity: ActivityNode, index: number) {
    const self = this;

    entity.predicate.removeEvidence(index);
    self.noctuaActivityFormService.initializeForm();
  }

  updateCurrentMenuEvent(event) {
    console.group(event)
    this.currentMenuEvent = event;
  }
}

