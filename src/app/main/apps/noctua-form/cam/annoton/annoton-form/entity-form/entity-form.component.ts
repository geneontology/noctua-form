import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { NoctuaFormDialogService } from './../../../../services/dialog.service';
import {
  CamService,
  NoctuaFormConfigService,
  NoctuaAnnotonFormService,
  AnnotonNode,
  Evidence,
  noctuaFormConfig,
  Entity,
  ShapeDefinition,
  AnnotonError,
  AnnotonNodeType,
  Annoton
} from 'noctua-form-base';
import { InlineReferenceService } from '@noctua.editor/inline-reference/inline-reference.service';
import { each, find, flatten } from 'lodash';
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
  entity: AnnotonNode;
  insertMenuItems = [];
  selectedItemDisplay;
  friendNodes;
  friendNodesFlat;

  annotonNodeType = AnnotonNodeType;

  private unsubscribeAll: Subject<any>;

  constructor(
    private noctuaFormDialogService: NoctuaFormDialogService,
    private camService: CamService,
    private inlineReferenceService: InlineReferenceService,
    private inlineDetailService: InlineDetailService,
    private inlineWithService: InlineWithService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.entity = this.noctuaAnnotonFormService.annoton.getNode(this.entityFormGroup.get('id').value);
    this.friendNodes = this.camService.getNodesByType(this.entity.type);
    //  this.friendNodesFlat = this.camService.getNodesByTypeFlat(this.entity.type);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  addEvidence() {
    const self = this;

    self.entity.predicate.addEvidence();
    self.noctuaAnnotonFormService.initializeForm();
  }

  useTerm(node: AnnotonNode, annoton: Annoton) {
    const self = this;

    self.entity.term = node.term;
    switch (self.entity.type) {
      case AnnotonNodeType.GoBiologicalProcess:
      case AnnotonNodeType.GoCellularComponent:
        self.entity.linkedNode = true;
        self.entity.uuid = node.uuid;
        self.noctuaAnnotonFormService.annoton.insertSubgraph(annoton, self.entity, node);
    }

    self.noctuaAnnotonFormService.initializeForm();
  }

  removeEvidence(index: number) {
    const self = this;

    self.entity.predicate.removeEvidence(index);
    self.noctuaAnnotonFormService.initializeForm();
  }

  toggleIsComplement(entity: AnnotonNode) {
    const self = this;
    const errors = [];
    let canToggle = true;

    each(entity.nodeGroup.nodes, function (node: AnnotonNode) {
      if (node.isExtension) {
        canToggle = false;
        const meta = {
          aspect: node.label
        };
        const error = new AnnotonError('error',
          1,
          `Cannot add 'NOT Qualifier', Remove Extension'${node.label}'`, meta);
        errors.push(error);
      }
    });

    if (canToggle) {
      entity.toggleIsComplement();
      self.noctuaAnnotonFormService.initializeForm();
    } else {
      self.noctuaFormDialogService.openAnnotonErrorsDialog(errors);
    }
  }

  openSearchDatabaseDialog(entity: AnnotonNode) {
    const self = this;
    const gpNode = this.noctuaAnnotonFormService.annoton.getGPNode();

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
        if (selected.term) {
          entity.term = new Entity(selected.term.term.id, selected.term.term.label);

          if (selected.evidences && selected.evidences.length > 0) {
            entity.predicate.setEvidence(selected.evidences);
          }
          self.noctuaAnnotonFormService.initializeForm();
        }
      };
      self.noctuaFormDialogService.openSearchDatabaseDialog(data, success);
    } else {
      // const error = new AnnotonError('error', 1, "Please enter a gene product", meta)
      //errors.push(error);
      // self.dialogService.openAnnotonErrorsDialog(ev, entity, errors)
    }
  }

  openSearchEvidenceDialog(entity: AnnotonNode) {
    const self = this;
    const gpNode = this.noctuaAnnotonFormService.annoton.getGPNode();

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
          self.noctuaAnnotonFormService.initializeForm();
        }
      };
      self.noctuaFormDialogService.openSearchEvidenceDialog(data, success);
    } else {
      // const error = new AnnotonError('error', 1, "Please enter a gene product", meta)
      //errors.push(error);
      // self.dialogService.openAnnotonErrorsDialog(ev, entity, errors)
    }
  }

  linkNode(entity: AnnotonNode) {
    const self = this;
    const nodes = this.camService.getNodesByType(entity.type);
    const data = {
      entity: entity,
      nodes: nodes
    };

    const success = function (selected) {
      if (selected.annotonNode) {
        const selectedAnnotonNode = selected.annotonNode as AnnotonNode;
        entity.uuid = selectedAnnotonNode.uuid;
        entity.term = selectedAnnotonNode.term;

        entity.linkedNode = true;
        console.log(1)
        //  self.noctuaAnnotonFormService.annoton.insertSubgraph(selected.annoton, entity.id);
        self.noctuaAnnotonFormService.initializeForm();
      }
    };
    self.noctuaFormDialogService.openLinkToExistingDialogComponent(data, success);

  }

  unlinkNode(entity: AnnotonNode) {
    entity.linkedNode = false;
    entity.uuid = null;
  }

  openSearchModels() {
    const self = this;
    const gpNode = this.noctuaAnnotonFormService.annoton.getGPNode();
    // const searchCriteria = new SearchCriteria();

    //searchCriteria.goterms.push(this.entity.term);

    // const url = this.noctuaFormConfigService.getUniversalWorkbenchUrl('noctua-search', searchCriteria.buildEncoded());

    // console.log(url);

    // window.open(url, '_blank');

  }

  insertEntity(nodeDescription: ShapeDefinition.ShapeDescription) {
    this.noctuaFormConfigService.insertAnnotonNode(this.noctuaAnnotonFormService.annoton, this.entity, nodeDescription);
    this.noctuaAnnotonFormService.initializeForm();
  }

  addRootTerm() {
    const self = this;

    const term = find(noctuaFormConfig.rootNode, (rootNode) => {
      return rootNode.aspect === self.entity.aspect;
    });

    if (term) {
      self.entity.term = new Entity(term.id, term.label);
      self.noctuaAnnotonFormService.initializeForm();

      const evidence = new Evidence();
      evidence.setEvidence(new Entity(
        noctuaFormConfig.evidenceAutoPopulate.nd.evidence.id,
        noctuaFormConfig.evidenceAutoPopulate.nd.evidence.label));
      evidence.reference = noctuaFormConfig.evidenceAutoPopulate.nd.reference;
      self.entity.predicate.setEvidence([evidence]);
      self.noctuaAnnotonFormService.initializeForm();
    }
  }

  clearValues() {
    const self = this;

    self.entity.clearValues();
    self.noctuaAnnotonFormService.initializeForm();
  }

  openSelectEvidenceDialog() {
    const self = this;
    const evidences: Evidence[] = this.camService.getUniqueEvidence(self.noctuaAnnotonFormService.annoton);
    const success = (selected) => {
      if (selected.evidences && selected.evidences.length > 0) {
        self.entity.predicate.setEvidence(selected.evidences, ['assignedBy']);
        self.noctuaAnnotonFormService.initializeForm();
      }
    };

    self.noctuaFormDialogService.openSelectEvidenceDialog(evidences, success);
  }

  updateTermList() {
    const self = this;
    this.camService.updateTermList(self.noctuaAnnotonFormService.annoton, this.entity);
  }

  updateEvidenceList() {
    const self = this;
    this.camService.updateEvidenceList(self.noctuaAnnotonFormService.annoton, this.entity);
  }

  updateReferenceList() {
    const self = this;
    this.camService.updateReferenceList(self.noctuaAnnotonFormService.annoton, this.entity);
  }

  updateWithList() {
    const self = this;
    this.camService.updateWithList(self.noctuaAnnotonFormService.annoton, this.entity);
  }

  openAddReference(event, evidence: FormGroup, name: string) {
    const data = {
      formControl: evidence.controls[name] as FormControl,
    };
    this.inlineReferenceService.open(event.target, { data });
  }

  openAddWith(event, evidence: FormGroup, name: string) {
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
