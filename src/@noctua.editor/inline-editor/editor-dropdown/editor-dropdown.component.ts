import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import {
  NoctuaFormConfigService,
  NoctuaAnnotonFormService,
  NoctuaAnnotonEntityService,
  CamService,
  Entity,
  noctuaFormConfig,
  InsertEntityDefinition
} from 'noctua-form-base';

import { Cam } from 'noctua-form-base';
import { Annoton } from 'noctua-form-base';
import { AnnotonNode } from 'noctua-form-base';
import { Evidence } from 'noctua-form-base';

import { editorDropdownData } from './editor-dropdown.tokens';
import { EditorDropdownOverlayRef } from './editor-dropdown-ref';
import { NoctuaFormDialogService } from 'app/main/apps/noctua-form';
import { EditorCategory } from './../../models/editor-category';
import { takeUntil } from 'rxjs/operators';
import { find } from 'lodash';
import { InlineReferenceService } from './../../inline-reference/inline-reference.service';

@Component({
  selector: 'noc-editor-dropdown',
  templateUrl: './editor-dropdown.component.html',
  styleUrls: ['./editor-dropdown.component.scss']
})

export class NoctuaEditorDropdownComponent implements OnInit, OnDestroy {
  EditorCategory = EditorCategory;
  annoton: Annoton;
  cam: Cam;
  insertEntity = false;
  entity: AnnotonNode;
  category: EditorCategory;
  evidenceIndex: number;
  entityFormGroup: FormGroup;
  evidenceFormGroup: FormGroup;
  entityFormSub: Subscription;

  termNode: AnnotonNode;

  private _unsubscribeAll: Subject<any>;

  displaySection = {
    term: false,
    evidence: false,
    reference: false,
    with: false,
  };

  constructor(public dialogRef: EditorDropdownOverlayRef,
    @Inject(editorDropdownData) public data: any,
    private noctuaFormDialogService: NoctuaFormDialogService,
    private camService: CamService,
    private noctuaAnnotonEntityService: NoctuaAnnotonEntityService,
    private inlineReferenceService: InlineReferenceService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
  ) {
    this._unsubscribeAll = new Subject();

    this.cam = data.cam;
    this.annoton = data.annoton;
    this.entity = data.entity;
    this.category = data.category;
    this.evidenceIndex = data.evidenceIndex;
    this.insertEntity = data.insertEntity;
  }

  ngOnInit(): void {
    this._displaySection(this.category);
    this.entityFormSub = this.noctuaAnnotonEntityService.entityFormGroup$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(entityFormGroup => {
        if (!entityFormGroup) {
          return;
        }
        const evidenceFormArray = entityFormGroup.get('evidenceFormArray') as FormArray;
        this.entityFormGroup = entityFormGroup;
        this.evidenceFormGroup = evidenceFormArray.at(this.evidenceIndex) as FormGroup;
        console.log(this.evidenceFormGroup);
      });
  }

  openAddReference(event, name: string) {

    const data = {
      formControl: this.evidenceFormGroup.controls[name] as FormControl,
    };
    this.inlineReferenceService.open(event.target, { data });

  }

  save() {
    const self = this;

    self.noctuaAnnotonEntityService.saveAnnoton().then(() => {
      this.close();
      self.noctuaFormDialogService.openSuccessfulSaveToast('Activity successfully updated.', 'OK');
    });
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
      }
      self.noctuaFormDialogService.openSearchDatabaseDialog(data, success);
    } else {
      // const error = new AnnotonError('error', 1, "Please enter a gene product", meta)
      //errors.push(error);
      // self.dialogService.openAnnotonErrorsDialog(ev, entity, errors)
    }
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


  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence ? evidence.label : undefined;
  }


  private _displaySection(category: EditorCategory) {
    switch (category) {
      case EditorCategory.term:
        this.displaySection.term = true;
        break;
      case EditorCategory.evidence:
        this.displaySection.evidence = true;
        break;
      case EditorCategory.reference:
        this.displaySection.reference = true;
        break;
      case EditorCategory.with:
        this.displaySection.with = true;
        break;
      case EditorCategory.evidenceAll:
        this.displaySection.evidence = true;
        this.displaySection.reference = true;
        this.displaySection.with = true;
        break;
      case EditorCategory.all:
        this.displaySection.term = true;
        this.displaySection.evidence = true;
        this.displaySection.reference = true;
        this.displaySection.with = true;
        break;
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

