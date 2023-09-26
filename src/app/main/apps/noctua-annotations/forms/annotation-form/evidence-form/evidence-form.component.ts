import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { NoctuaAnnotationsDialogService } from './../../../services/dialog.service';
import {
  CamService,
  NoctuaFormConfigService,
  NoctuaAnnotationFormService,
  ActivityNode,
  Evidence,
  noctuaFormConfig,
  Entity,
  ShapeDefinition,
  ActivityError,
  ActivityNodeType,
  Activity,
  ErrorLevel,
  ErrorType,
  ActivityType
} from '@geneontology/noctua-form-base';
import { InlineReferenceService } from '@noctua.editor/inline-reference/inline-reference.service';
import { each, find } from 'lodash';
import { InlineWithService } from '@noctua.editor/inline-with/inline-with.service';
import { InlineDetailService } from '@noctua.editor/inline-detail/inline-detail.service';
import { NoctuaFormDialogService } from 'app/main/apps/noctua-form/services/dialog.service';

@Component({
  selector: 'noc-annotation-evidence-form',
  templateUrl: './evidence-form.component.html',
  styleUrls: ['./evidence-form.component.scss'],
})

export class AnnotationEvidenceFormComponent implements OnInit, OnDestroy {
  @Input('entityFormGroup')
  entityFormGroup: FormGroup

  entity: ActivityNode;

  @ViewChild('evidenceDBreferenceMenuTrigger', { static: true, read: MatMenuTrigger })
  evidenceDBreferenceMenuTrigger: MatMenuTrigger;

  evidenceDBForm: FormGroup;
  evidenceFormArray: FormArray;

  selectedItemDisplay;
  friendNodes;
  friendNodesFlat;
  activityNodeType = ActivityNodeType;
  displayAddButton = false;

  termData

  private unsubscribeAll: Subject<any>;

  constructor(
    private noctuaAnnotationsDialogService: NoctuaAnnotationsDialogService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    private camService: CamService,
    private inlineReferenceService: InlineReferenceService,
    private inlineDetailService: InlineDetailService,
    private inlineWithService: InlineWithService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotationFormService: NoctuaAnnotationFormService) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.entity = this.noctuaAnnotationFormService.activity.getNode(this.entityFormGroup.value['id']);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }


  updateTermList() {
    const self = this;
    this.camService.updateTermList(self.noctuaAnnotationFormService.activity, this.entity);
  }

  updateEvidenceList() {
    const self = this;
    this.camService.updateEvidenceList(self.noctuaAnnotationFormService.activity, this.entity);
  }

  updateReferenceList() {
    const self = this;
    this.camService.updateReferenceList(self.noctuaAnnotationFormService.activity, this.entity);
  }

  updateWithList() {
    const self = this;
    this.camService.updateWithList(self.noctuaAnnotationFormService.activity, this.entity);
  }

  openAddReference(event, evidence: FormGroup, name: string) {
    event.stopPropagation();
    const data = {
      formControl: evidence.controls[name] as FormControl,
    };
    this.inlineReferenceService.open(event.target, { data });
  }

  openAddWith(event, evidence: FormGroup, name: string) {
    event.stopPropagation();
    const data = {
      formControl: evidence.controls[name] as FormControl,
    };
    this.inlineWithService.open(event.target, { data });
  }

  unselectItemDisplay() {
    this.selectedItemDisplay = null;
  }



  evidenceDisplayFn(evidence): string | undefined {
    return evidence && evidence.id ? `${evidence.label} (${evidence.id})` : undefined;
  }

  referenceDisplayFn(evidence: Evidence | string): string | undefined {
    if (typeof evidence === 'string') {
      return evidence;
    }

    return evidence && evidence.reference ? evidence.reference : undefined;
  }

  withDisplayFn(evidence: Evidence | string): string | undefined {
    if (typeof evidence === 'string') {
      return evidence;
    }

    return evidence && evidence.with ? evidence.with : undefined;
  }
}
