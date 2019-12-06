import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { noctuaAnimations } from './../../../../../../../@noctua/animations';


import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

import { NoctuaFormService } from './../../../services/noctua-form.service';
import { CamTableService } from './../services/cam-table.service';
import { NoctuaFormDialogService } from './../../../services/dialog.service';
import { NoctuaSearchService } from './../../../../../../../@noctua.search/services/noctua-search.service';

import {
  NoctuaGraphService,
  NoctuaFormConfigService,
  NoctuaAnnotonFormService,
  NoctuaLookupService,
  NoctuaAnnotonEntityService,
  CamService,
  Evidence,
  Entity,
  noctuaFormConfig,
  NoctuaUserService
} from 'noctua-form-base';

import {
  Cam,
  Annoton,
  AnnotonNode,
  InsertEntityDefinition
} from 'noctua-form-base';

import { SparqlService } from './../../../../../../../@noctua.sparql/services/sparql/sparql.service';
import { EditorCategory } from '@noctua.editor/models/editor-category';

import { find } from 'lodash';
import { InlineEditorService } from '@noctua.editor/inline-editor/inline-editor.service';
import { NoctuaEditorDialogService } from '@noctua.editor/services/dialog.service';

@Component({
  selector: 'noc-annoton-table',
  templateUrl: './annoton-table.component.html',
  styleUrls: ['./annoton-table.component.scss'],
  animations: noctuaAnimations
})
export class AnnotonTableComponent implements OnInit, OnDestroy {
  EditorCategory = EditorCategory;

  displayedColumns = [
    'relationship',
    'aspect',
    'term',
    'relationshipExt',
    'extension',
    'evidence',
    'reference',
    'with',
    'assignedBy',
    'actions'];

  grid: any[] = [];

  @Input('cam')
  public cam: Cam

  @Input('annoton')
  public annoton: Annoton

  public currentMenuEvent: any = {};

  private unsubscribeAll: Subject<any>;

  constructor(private camService: CamService,
    public noctuaFormService: NoctuaFormService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public camTableService: CamTableService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaAnnotonEntityService: NoctuaAnnotonEntityService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    private inlineEditorService: InlineEditorService) {

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.loadCam();
  }

  loadCam() {
    this.grid = this.annoton.grid;
  }

  addEvidence(entity: AnnotonNode) {
    const self = this;

    entity.predicate.addEvidence();
    const data = {
      cam: this.cam,
      annoton: this.annoton,
      entity: entity,
      category: EditorCategory.evidenceAll,
      evidenceIndex: entity.predicate.evidence.length - 1
    };

    this.camService.onCamChanged.next(this.cam);
    this.camService.annoton = this.annoton;
    this.noctuaAnnotonEntityService.initializeForm(this.annoton, entity);
    this.inlineEditorService.open(this.currentMenuEvent.target, { data });

    self.noctuaAnnotonFormService.initializeForm();
  }

  removeEvidence(entity: AnnotonNode, index: number) {
    const self = this;

    entity.predicate.removeEvidence(index);
    self.noctuaAnnotonFormService.initializeForm();
  }

  toggleIsComplement() {

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


  insertEntity(entity: AnnotonNode, nodeDescription: InsertEntityDefinition.InsertNodeDescription) {
    const insertedNode = this.noctuaFormConfigService.insertAnnotonNode(this.annoton, entity, nodeDescription);
    //  this.noctuaAnnotonFormService.initializeForm();

    const data = {
      cam: this.cam,
      annoton: this.annoton,
      entity: insertedNode,
      category: EditorCategory.all,
      evidenceIndex: 0,
      insertEntity: true
    };

    this.camService.onCamChanged.next(this.cam);
    this.camService.annoton = this.annoton;
    this.noctuaAnnotonEntityService.initializeForm(this.annoton, insertedNode);
    this.inlineEditorService.open(this.currentMenuEvent.target, { data });
  }

  addRootTerm(entity: AnnotonNode) {
    const self = this;

    const term = find(noctuaFormConfig.rootNode, (rootNode) => {
      return rootNode.aspect === entity.aspect;
    });

    if (term) {
      entity.term = new Entity(term.id, term.label);
      self.noctuaAnnotonFormService.initializeForm();

      const evidence = new Evidence();
      evidence.setEvidence(new Entity(
        noctuaFormConfig.evidenceAutoPopulate.nd.evidence.id,
        noctuaFormConfig.evidenceAutoPopulate.nd.evidence.label));
      evidence.reference = noctuaFormConfig.evidenceAutoPopulate.nd.reference;
      entity.predicate.setEvidence([evidence]);
      self.noctuaAnnotonFormService.initializeForm();
    }
  }

  clearValues(entity: AnnotonNode) {
    const self = this;

    entity.clearValues();
    self.noctuaAnnotonFormService.initializeForm();
  }

  openSelectEvidenceDialog(entity: AnnotonNode) {
    const self = this;
    const evidences: Evidence[] = this.camService.getUniqueEvidence(self.noctuaAnnotonFormService.annoton);
    const success = (selected) => {
      if (selected.evidences && selected.evidences.length > 0) {
        entity.predicate.setEvidence(selected.evidences, ['assignedBy']);
        self.noctuaAnnotonFormService.initializeForm();
      }
    };

    self.noctuaFormDialogService.openSelectEvidenceDialog(evidences, success);
  }

  selectEntity(entity: AnnotonNode) {
    this.camService.onCamChanged.next(this.cam);

    this.noctuaAnnotonEntityService.initializeForm(this.annoton, entity);
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.annotonEntityForm);

  }

  updateCurrentMenuEvent(event) {
    this.currentMenuEvent = event;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}

