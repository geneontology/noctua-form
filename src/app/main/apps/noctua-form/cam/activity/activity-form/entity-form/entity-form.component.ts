import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { NoctuaFormDialogService } from './../../../../services/dialog.service';
import {
  CamService,
  NoctuaFormConfigService,
  NoctuaActivityFormService,
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

@Component({
  selector: 'noc-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss'],
})

export class EntityFormComponent implements OnInit, OnDestroy {
  @Input('entityFormGroup')
  public entityFormGroup: FormGroup;

  @ViewChild('evidenceDBreferenceMenuTrigger', { static: true, read: MatMenuTrigger })
  evidenceDBreferenceMenuTrigger: MatMenuTrigger;

  evidenceDBForm: FormGroup;
  evidenceFormArray: FormArray;
  entity: ActivityNode;
  selectedItemDisplay;
  friendNodes;
  friendNodesFlat;
  activityNodeType = ActivityNodeType;
  displayAddButton = false;

  termData

  private unsubscribeAll: Subject<any>;

  constructor(
    private noctuaFormDialogService: NoctuaFormDialogService,
    private camService: CamService,
    private inlineReferenceService: InlineReferenceService,
    private inlineDetailService: InlineDetailService,
    private inlineWithService: InlineWithService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.entity = this.noctuaActivityFormService.activity.getNode(this.entityFormGroup.get('id').value);
    this.friendNodes = this.camService.getNodesByType(this.entity.type);
    if (this.noctuaActivityFormService.activity.activityType === ActivityType.ccOnly
      && this.entity.treeLevel === 1) {
      this.displayAddButton = true;
    }

    if (this.noctuaActivityFormService.activity.activityType === ActivityType.proteinComplex
      && this.entity.type === ActivityNodeType.GoProteinContainingComplex) {
      this.displayAddButton = true;
    }
    //  this.friendNodesFlat = this.camService.getNodesByTypeFlat(this.entity.type);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  addEvidence() {
    const self = this;

    self.entity.predicate.addEvidence();
    self.noctuaActivityFormService.initializeForm();
  }

  useTerm(node: ActivityNode, activity: Activity) {
    const self = this;

    self.entity.term = node.term;
    switch (self.entity.type) {
      case ActivityNodeType.GoBiologicalProcess:
      case ActivityNodeType.GoCellularComponent:
        self.entity.linkedNode = true;
        self.entity.uuid = node.uuid;
        self.noctuaActivityFormService.activity.insertSubgraph(activity, self.entity, node);
    }

    self.noctuaActivityFormService.initializeForm();
  }

  removeEvidence(index: number) {
    const self = this;

    self.entity.predicate.removeEvidence(index);
    self.noctuaActivityFormService.initializeForm();
  }

  toggleIsComplement(entity: ActivityNode) {
    const self = this;
    const errors = [];
    let canToggle = true;

    each(entity.nodeGroup.nodes, function (node: ActivityNode) {
      if (node.isExtension) {
        canToggle = false;
        const meta = {
          aspect: node.label
        };
        const error = new ActivityError(ErrorLevel.error, ErrorType.general,
          `Cannot add 'NOT Qualifier', Remove Extension'${node.label}'`, meta);
        errors.push(error);
      }
    });

    if (canToggle) {
      entity.toggleIsComplement();
      self.noctuaActivityFormService.initializeForm();
    } else {
      self.noctuaFormDialogService.openActivityErrorsDialog(errors);
    }
  }

  openSearchDatabaseDialog(entity: ActivityNode) {
    const self = this;
    const gpNode = this.noctuaActivityFormService.activity.gpNode

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
                /*      evidenceExt.relations.forEach((relation) => {
                       const node = self.noctuaFormConfigService.insertActivityNodeByPredicate(self.noctuaActivityFormService.activity, self.entity, relation.id);
                       node.term = new Entity(evidenceExt.term.id, evidenceExt.term.id);
                       node.predicate.setEvidence([evidence]);
                     }); */
              });

            });
          }


          self.noctuaActivityFormService.initializeForm();
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
    const gpNode = this.noctuaActivityFormService.activity.gpNode

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
          self.noctuaActivityFormService.initializeForm();
        }
      };
      self.noctuaFormDialogService.openSearchEvidenceDialog(data, success);
    } else {
      // const error = new ActivityError(ErrorLevel.error, ErrorType.general,  "Please enter a gene product", meta)
      //errors.push(error);
      // self.dialogService.openActivityErrorsDialog(ev, entity, errors)
    }
  }

  linkNode(entity: ActivityNode) {
    const self = this;
    const nodes = this.camService.getNodesByType(entity.type);
    const data = {
      entity: entity,
      nodes: nodes
    };

    const success = function (selected) {
      if (selected.activityNode) {
        const selectedActivityNode = selected.activityNode as ActivityNode;
        entity.uuid = selectedActivityNode.uuid;
        entity.term = selectedActivityNode.term;

        entity.linkedNode = true;
        //  self.noctuaActivityFormService.activity.insertSubgraph(selected.activity, entity.id);
        self.noctuaActivityFormService.initializeForm();
      }
    };
    self.noctuaFormDialogService.openLinkToExistingDialogComponent(data, success);

  }

  unlinkNode(entity: ActivityNode) {
    entity.linkedNode = false;
    entity.uuid = null;
  }

  openSearchModels() {
    const self = this;
    const gpNode = this.noctuaActivityFormService.activity.gpNode;
    // const searchCriteria = new SearchCriteria();

    //searchCriteria.goterms.push(this.entity.term);

    // const url = this.noctuaFormConfigService.getUniversalWorkbenchUrl('noctua-search', searchCriteria.buildEncoded());


    // window.open(url, '_blank');

  }


  insertEntityShex(predExpr: ShapeDefinition.PredicateExpression) {
    this.noctuaFormConfigService.insertActivityNodeShex(this.noctuaActivityFormService.activity, this.entity, predExpr);
    this.noctuaActivityFormService.initializeForm();
  }

  addRootTerm() {
    const self = this;

    const term = find(noctuaFormConfig.rootNode, (rootNode) => {
      return rootNode.aspect === self.entity.aspect;
    });

    if (term) {
      self.entity.term = new Entity(term.id, term.label);
      self.noctuaActivityFormService.initializeForm();

      const evidence = new Evidence();
      evidence.setEvidence(new Entity(
        noctuaFormConfig.evidenceAutoPopulate.nd.evidence.id,
        noctuaFormConfig.evidenceAutoPopulate.nd.evidence.label));
      evidence.reference = noctuaFormConfig.evidenceAutoPopulate.nd.reference;
      self.entity.predicate.setEvidence([evidence]);
      self.noctuaActivityFormService.initializeForm();
    }
  }

  clearValues() {
    const self = this;

    self.entity.clearValues();
    self.noctuaActivityFormService.initializeForm();
  }

  removeNode() {
    const self = this;

    self.noctuaActivityFormService.activity.removeNode(self.entity);
    self.noctuaActivityFormService.initializeForm();
  }

  openSelectEvidenceDialog() {
    const self = this;
    const evidences: Evidence[] = this.camService.getUniqueEvidence(self.noctuaActivityFormService.activity);
    const success = (selected) => {
      if (selected.evidences && selected.evidences.length > 0) {
        self.entity.predicate.setEvidence(selected.evidences);
        self.noctuaActivityFormService.initializeForm();
      }
    };

    self.noctuaFormDialogService.openSelectEvidenceDialog(evidences, success);
  }
  updateMenu(entity) {
    this.noctuaActivityFormService.initializeForm(entity.rootTypes);
  }

  updateTermList() {
    const self = this;
    this.camService.updateTermList(self.noctuaActivityFormService.activity, this.entity);
  }

  updateEvidenceList() {
    const self = this;
    this.camService.updateEvidenceList(self.noctuaActivityFormService.activity, this.entity);
  }

  updateReferenceList() {
    const self = this;
    this.camService.updateReferenceList(self.noctuaActivityFormService.activity, this.entity);
  }

  updateWithList() {
    const self = this;
    this.camService.updateWithList(self.noctuaActivityFormService.activity, this.entity);
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
