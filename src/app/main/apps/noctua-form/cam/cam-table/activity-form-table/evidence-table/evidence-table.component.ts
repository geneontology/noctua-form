
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { noctuaAnimations } from './../../../../../../../../@noctua/animations';


import {
  NoctuaFormConfigService,
  NoctuaActivityEntityService,
  CamService,
  NoctuaUserService,
  NoctuaActivityFormService,
  Evidence,
} from '@geneontology/noctua-form-base';

import {
  Cam,
  Activity,
  ActivityNode
} from '@geneontology/noctua-form-base';
import { EditorCategory } from '@noctua.editor/models/editor-category';
import { SettingsOptions } from '@noctua.common/models/graph-settings';
import { InlineEditorService } from '@noctua.editor/inline-editor/inline-editor.service';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { NoctuaFormDialogService } from 'app/main/apps/noctua-form/services/dialog.service';


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
    private confirmDialogService: NoctuaConfirmDialogService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    private inlineEditorService: InlineEditorService,
    public noctuaActivityEntityService: NoctuaActivityEntityService) {

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
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

  createEvidence() {
    const self = this;

    const success = (evidence: Evidence[]) => {
      if (evidence) {
        this.camService.onCamChanged.next(this.cam);
        this.camService.activity = this.activity;
        this.noctuaActivityEntityService.initializeForm(this.activity, this.entity);

        self.noctuaActivityEntityService.createEvidence(evidence).then(() => {
          self.noctuaFormDialogService.openInfoToast(`Evidence successfully added.`, 'OK');
          self.noctuaActivityFormService.initializeForm();
        });
      };
    }
    this.noctuaFormDialogService.openAddEvidenceDialog(success);
  }

  removeEvidence(evidence: Evidence) {
    const self = this;

    const success = () => {
      self.noctuaActivityEntityService.deleteEvidence(evidence.uuid).then(() => {
        self.noctuaFormDialogService.openInfoToast(`${evidence.evidence.label} successfully deleted.`, 'OK');
      });
    };

    let message = `You are about to delete ${evidence.evidence.label} \n 
      ${evidence.reference} \n 
      ${evidence.with}`;

    this.confirmDialogService.openConfirmDialog('Confirm Delete?',
      `${message}`, success);
  }

  removeReference(evidence: Evidence) {
    const self = this;

    const success = () => {
      self.noctuaActivityEntityService.deleteEvidenceReference(evidence.uuid, evidence.reference).then(() => {
        self.noctuaFormDialogService.openInfoToast(`${evidence.reference} successfully deleted.`, 'OK');
      });
    };

    let message = `You are about to delete Reference:  ${evidence.reference}`

    this.confirmDialogService.openConfirmDialog('Confirm Delete?',
      `${message}`, success);
  }

  removeWith(evidence: Evidence) {
    const self = this;

    const success = () => {
      self.noctuaActivityEntityService.deleteEvidenceWith(evidence.uuid, evidence.with).then(() => {
        self.noctuaFormDialogService.openInfoToast(`${evidence.with} successfully deleted.`, 'OK');
      });
    };

    let message = `You are about to delete With/From:  ${evidence.with}`

    this.confirmDialogService.openConfirmDialog('Confirm Delete?',
      `${message}`, success);
  }



  updateCurrentMenuEvent(event) {
    this.currentMenuEvent = event;
  }
}

