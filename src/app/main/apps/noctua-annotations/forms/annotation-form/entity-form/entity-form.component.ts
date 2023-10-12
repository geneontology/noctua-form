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
  selector: 'noc-annotation-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss'],
})

export class AnnotationEntityFormComponent implements OnInit, OnDestroy {
  @Input('entityFormGroup')
  public entityFormGroup: FormGroup;

  private _selectTerm: (term: any) => void = this.updateMenu; // Initialize with default function

  @Input()
  set selectTerm(fn: (term: any) => void) {
    if (fn) {
      this._selectTerm = fn;
    }
  }

  get selectTerm(): (term: any) => void {
    return this._selectTerm;
  }


  @ViewChild('evidenceDBreferenceMenuTrigger', { static: true, read: MatMenuTrigger })
  evidenceDBreferenceMenuTrigger: MatMenuTrigger;

  evidenceDBForm: FormGroup;
  evidenceFormArray: FormArray;
  entity: ActivityNode;
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
    // const xx = this.entityFormGroup.value['id']
    this.entity = this.noctuaAnnotationFormService.activity.getNode(this.entityFormGroup.value['id']);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  addEvidence() {
    const self = this;

    self.entity.predicate.addEvidence();
    self.noctuaAnnotationFormService.initializeForm();
  }

  useTerm(node: ActivityNode, activity: Activity) {
    const self = this;

    self.entity.term = node.term;
    switch (self.entity.type) {
      case ActivityNodeType.GoBiologicalProcess:
      case ActivityNodeType.GoCellularComponent:
        self.entity.linkedNode = true;
        self.entity.uuid = node.uuid;
        self.noctuaAnnotationFormService.activity.insertSubgraph(activity, self.entity, node);
    }

    self.noctuaAnnotationFormService.initializeForm();
  }

  removeEvidence(index: number) {
    const self = this;

    self.entity.predicate.removeEvidence(index);
    self.noctuaAnnotationFormService.initializeForm();
  }

  openSearchDatabaseDialog(entity: ActivityNode) {
    const self = this;
    const gpNode = this.noctuaAnnotationFormService.activity.gpNode

    if (gpNode && gpNode.hasValue()) {
      const data = {
        readonly: false,
        gpNode: gpNode.term,
        aspect: entity.aspect,
        entity: entity,
        params: {
          term: '',
          evidence: ''
        }
      };

      const success = (selected) => {
        if (selected.term) {
          entity.term = new Entity(selected.term.term.id, selected.term.term.label);

          if (selected.evidences && selected.evidences.length > 0) {
            entity.predicate.setEvidence(selected.evidences);

            selected.evidences.forEach((evidence: Evidence) => {

              evidence.evidenceExts.forEach((evidenceExt) => {
                /*                 evidenceExt.relations.forEach((relation) => {
                                  const node = self.noctuaFormConfigService.insertActivityNodeByPredicate(self.noctuaAnnotationFormService.activity, self.entity, relation.id);
                                  node.term = new Entity(evidenceExt.term.id, evidenceExt.term.id);
                                  node.predicate.setEvidence([evidence]);
                                }); */
              });

            });
          }


          self.noctuaAnnotationFormService.initializeForm();
        }
      };
      self.noctuaFormDialogService.openSearchDatabaseDialog(data, success);
    } else {
      const meta = {
        aspect: 'Gene Product'
      };
      const error = new ActivityError(ErrorLevel.error, ErrorType.general, 'Please enter a gene product', meta)
      self.noctuaFormDialogService.openActivityErrorsDialog([error])
    }
  }

  openSearchEvidenceDialog(entity: ActivityNode) {
    const self = this;
    const gpNode = this.noctuaAnnotationFormService.activity.gpNode

    if (gpNode) {
      const data = {
        readonly: false,
        gpNode: gpNode.term,
        aspect: entity.aspect,
        entity: entity,
        params: {
          term: '',
          evidence: ''
        }
      };

      const success = function (selected) {
        if (selected && selected.evidences) {
          entity.predicate.setEvidence(selected.evidences);
          self.noctuaAnnotationFormService.initializeForm();
        }
      };
      self.noctuaFormDialogService.openSearchEvidenceDialog(data, success);
    } else {
      // const error = new ActivityError(ErrorLevel.error, ErrorType.general,  "Please enter a gene product", meta)
      //errors.push(error);
      // self.dialogService.openActivityErrorsDialog(ev, entity, errors)
    }
  }

  openSearchModels() {
    const self = this;
    const gpNode = this.noctuaAnnotationFormService.activity.gpNode;
    // const searchCriteria = new SearchCriteria();

    //searchCriteria.goterms.push(this.entity.term);

    // const url = this.noctuaFormConfigService.getUniversalWorkbenchUrl('noctua-search', searchCriteria.buildEncoded());


    // window.open(url, '_blank');

  }


  insertEntityShex(predExpr: ShapeDefinition.PredicateExpression) {
    this.noctuaFormConfigService.insertActivityNodeShex(this.noctuaAnnotationFormService.activity, this.entity, predExpr);
    this.noctuaAnnotationFormService.initializeForm();
  }

  addRootTerm() {
    const self = this;

    const term = find(noctuaFormConfig.rootNode, (rootNode) => {
      return rootNode.aspect === self.entity.aspect;
    });

    if (term) {
      self.entity.term = new Entity(term.id, term.label);
      self.noctuaAnnotationFormService.initializeForm();

      const evidence = new Evidence();
      evidence.setEvidence(new Entity(
        noctuaFormConfig.evidenceAutoPopulate.nd.evidence.id,
        noctuaFormConfig.evidenceAutoPopulate.nd.evidence.label));
      evidence.reference = noctuaFormConfig.evidenceAutoPopulate.nd.reference;
      self.entity.predicate.setEvidence([evidence]);
      self.noctuaAnnotationFormService.initializeForm();
    }
  }

  clearValues() {
    const self = this;

    self.entity.clearValues();
    self.noctuaAnnotationFormService.initializeForm();
  }

  removeNode() {
    const self = this;

    self.noctuaAnnotationFormService.activity.removeNode(self.entity);
    self.noctuaAnnotationFormService.initializeForm();
  }

  updateMenu(entity) {
    // this.noctuaAnnotationFormService.initializeForm(entity.rootTypes);
  }

  updateTermList() {
    const self = this;
    // this.camService.updateTermList(self.noctuaAnnotationFormService.activity, this.entity);
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



  openTermDetails(event, item) {
    event.stopPropagation();

    const data = {
      termDetail: item,
      formControl: this.entityFormGroup.controls['term'] as FormControl,
    };
    this.inlineDetailService.open(event.target, { data });

    //this.termData = data

  }

  termDisplayFn(term): string | undefined {
    return term && term.id ? `${term.label} (${term.id})` : undefined;
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
