import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';
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
  InsertEntityDefinition,
  AnnotonError
} from 'noctua-form-base';
import { InlineReferenceService } from '@noctua.editor/inline-reference/inline-reference.service';
import { each, find } from 'lodash';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { SearchCriteria } from '@noctua.search/models/search-criteria';

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

  private unsubscribeAll: Subject<any>;

  constructor(
    private noctuaFormDialogService: NoctuaFormDialogService,
    private camService: CamService,
    private noctuaSearchService: NoctuaSearchService,
    private inlineReferenceService: InlineReferenceService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.entity = this.noctuaAnnotonFormService.annoton.getNode(this.entityFormGroup.get('id').value);
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

  openSearchModels() {
    const self = this;
    const gpNode = this.noctuaAnnotonFormService.annoton.getGPNode();
    const searchCriteria = new SearchCriteria();

    searchCriteria.goterms.push(this.entity.term);

    const url = this.noctuaFormConfigService.getUniversalWorkbenchUrl('noctua-search', searchCriteria.buildEncoded());

    console.log(url);

    window.open(url, '_blank');

  }

  insertEntity(nodeDescription: InsertEntityDefinition.InsertNodeDescription) {
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

  openAddReference(event, evidence: FormGroup, name: string) {

    const data = {
      formControl: evidence.controls[name] as FormControl,
    };
    this.inlineReferenceService.open(event.target, { data });

  }


  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence ? evidence.label : undefined;
  }
}
