import { Component, Inject, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { Subscription, Subject, EMPTY } from 'rxjs';
import {
  NoctuaFormConfigService,
  NoctuaActivityFormService,
  NoctuaActivityEntityService,
  CamService,
  Entity,
  noctuaFormConfig,
  ActivityError,
  ErrorType,
  ErrorLevel,
} from '@geneontology/noctua-form-base';

import { Cam } from '@geneontology/noctua-form-base';
import { Activity } from '@geneontology/noctua-form-base';
import { ActivityNode } from '@geneontology/noctua-form-base';
import { Evidence } from '@geneontology/noctua-form-base';

import { editorDropdownData } from './editor-dropdown.tokens';
import { EditorDropdownOverlayRef } from './editor-dropdown-ref';
import { EditorCategory } from './../../models/editor-category';
import { concatMap, finalize, take, takeUntil } from 'rxjs/operators';
import { find } from 'lodash';
import { InlineReferenceService } from './../../inline-reference/inline-reference.service';
import { NoctuaFormDialogService } from 'app/main/apps/noctua-form/services/dialog.service';

@Component({
  selector: 'noc-editor-dropdown',
  templateUrl: './editor-dropdown.component.html',
  styleUrls: ['./editor-dropdown.component.scss']
})

export class NoctuaEditorDropdownComponent implements OnInit, OnDestroy {
  EditorCategory = EditorCategory;
  activity: Activity;
  cam: Cam;
  insertEntity = false;
  entity: ActivityNode;
  category: EditorCategory;
  evidenceIndex: number;
  entityFormGroup: FormGroup;
  evidenceFormGroup: FormGroup;
  entityFormSub: Subscription;
  termNode: ActivityNode;

  private _unsubscribeAll: Subject<any>;

  displaySection = {
    relationship: false,
    term: false,
    evidence: false,
    reference: false,
    with: false,
  };

  constructor(
    private zone: NgZone,
    public dialogRef: EditorDropdownOverlayRef,
    @Inject(editorDropdownData) public data: any,
    private noctuaFormDialogService: NoctuaFormDialogService,
    private camService: CamService,
    private noctuaActivityEntityService: NoctuaActivityEntityService,
    private inlineReferenceService: InlineReferenceService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
  ) {
    this._unsubscribeAll = new Subject();

    this.cam = data.cam;
    this.activity = data.activity;
    this.entity = data.entity;
    this.category = data.category;
    this.evidenceIndex = data.evidenceIndex;
    this.insertEntity = data.insertEntity;
  }

  ngOnInit(): void {
    this._displaySection(this.category);
    this.entityFormSub = this.noctuaActivityEntityService.entityFormGroup$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(entityFormGroup => {
        if (!entityFormGroup) {
          return;
        }
        const evidenceFormArray = entityFormGroup.get('evidenceFormArray') as FormArray;
        this.entityFormGroup = entityFormGroup;
        this.evidenceFormGroup = evidenceFormArray.at(this.evidenceIndex) as FormGroup;
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
    switch (self.category) {
      case EditorCategory.term:
      case EditorCategory.evidence:
      case EditorCategory.reference:
      case EditorCategory.with:
      case EditorCategory.relationship:
        this.close();
        self.noctuaActivityEntityService.saveActivityReplace(self.cam).pipe(
          take(1),
          concatMap((result) => {
            return EMPTY;
            //return self.camService.getStoredModel(self.cam)
          }),
          finalize(() => {
            self.zone.run(() => {
              self.cam.loading.status = false;
              self.cam.reviewCamChanges()
              //self.camService.reviewChangesCams();
            })
          }))
          .subscribe(() => {
            self.zone.run(() => {

            })
            // self.noctuaFormDialogService.openInfoToast('Activity successfully updated.', 'OK');

          });
        break;
      case EditorCategory.evidenceAll:
        self.noctuaActivityEntityService.addEvidence().then(() => {
          this.close();
          self.noctuaFormDialogService.openInfoToast('Evidence successfully updated.', 'OK');
        });
        break;
      case EditorCategory.all:
        self.noctuaActivityEntityService.addIndividual().then(() => {
          this.close();
          self.noctuaFormDialogService.openInfoToast('Activity successfully updated.', 'OK');
        });
        break;
    }
  }

  openSearchDatabaseDialog(entity: ActivityNode) {
    const self = this;
    const gpNode = this.activity.gpNode;

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
          const term = new Entity(selected.term.term.id, selected.term.term.label);

          if (selected.evidences && selected.evidences.length > 0) {
            self.noctuaActivityEntityService.reinitializeForm(term, selected.evidences);

          }
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

  addRootTerm() {
    const self = this;

    const term = find(noctuaFormConfig.rootNode, (rootNode) => {
      return rootNode.aspect === self.entity.aspect;
    });

    if (term) {

      const evidence = new Evidence();
      evidence.setEvidence(new Entity(
        noctuaFormConfig.evidenceAutoPopulate.nd.evidence.id,
        noctuaFormConfig.evidenceAutoPopulate.nd.evidence.label));
      evidence.reference = noctuaFormConfig.evidenceAutoPopulate.nd.reference;
      self.noctuaActivityEntityService.reinitializeForm(new Entity(term.id, term.label), [evidence]);
    }
  }

  clearValues() {
    const self = this;

    self.entity.clearValues();
    self.noctuaActivityFormService.initializeForm();
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


  termDisplayFn(term): string | undefined {
    return term && term.id ? `${term.label} (${term.id})` : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence && evidence.id ? `${evidence.label} (${evidence.id})` : undefined;
  }

  compareEntity(a: any, b: any) {
    return (a.id === b.id);
  }

  private _displaySection(category: EditorCategory) {
    switch (category) {
      case EditorCategory.relationship:
        this.displaySection.relationship = true;
        break;
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
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}

