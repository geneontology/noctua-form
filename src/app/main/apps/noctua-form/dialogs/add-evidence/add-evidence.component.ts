
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { ActivityNode, CamService, EntityDefinition, EntityForm, NoctuaActivityEntityService, NoctuaFormConfigService } from '@geneontology/noctua-form-base';
import { InlineReferenceService } from '@noctua.editor/inline-reference/inline-reference.service';


@Component({
  selector: 'app-add-evidence',
  templateUrl: './add-evidence.component.html',
  styleUrls: ['./add-evidence.component.scss']
})
export class AddEvidenceDialogComponent implements OnInit, OnDestroy {
  private _fb = new FormBuilder();
  private _unsubscribeAll: Subject<any>;
  searchFormData: any = {};
  cam: any = {};
  entityForm: EntityForm;
  evidenceFormGroup: FormGroup;
  entity: ActivityNode;

  constructor(
    private _matDialogRef: MatDialogRef<AddEvidenceDialogComponent>,
    private _noctuaActivityEntityService: NoctuaActivityEntityService,
    private camService: CamService,
    private inlineReferenceService: InlineReferenceService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public noctuaFormConfigService: NoctuaFormConfigService,
  ) {
    this._unsubscribeAll = new Subject();

    this.evidenceFormGroup = this.createEvidenceForm();
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  createEvidenceForm() {
    this.entity = EntityDefinition.generateBaseTerm([]);
    this.entityForm = this._noctuaActivityEntityService.createActivityEntityForm(this.entity);
    const entityFormGroup = this._fb.group(this.entityForm);
    const evidenceFormArray = entityFormGroup.get('evidenceFormArray') as FormArray;
    return evidenceFormArray.at(0) as FormGroup;

  }


  clearValues() {
    this.entity.clearValues();
  }

  openAddReference(event, name: string) {
    const data = {
      formControl: this.evidenceFormGroup.controls[name] as FormControl,
    };
    this.inlineReferenceService.open(event.target, { data });
  }

  updateEvidenceList() {
    this.camService.updateEvidenceList(null, this.entity);
  }

  updateReferenceList() {
    this.camService.updateReferenceList(null, this.entity);
  }

  updateWithList() {
    this.camService.updateWithList(null, this.entity);
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence && evidence.id ? `${evidence.label} (${evidence.id})` : undefined;
  }

  save() {
    this.entityForm.populateTermEvidenceOnly();
    this._matDialogRef.close(this.entity.predicate.evidence);
  }

  close() {
    this._matDialogRef.close();
  }
}
