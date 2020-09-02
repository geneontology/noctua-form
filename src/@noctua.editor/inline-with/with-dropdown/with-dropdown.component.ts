import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, startWith, map } from 'rxjs/operators';

import {
  NoctuaFormConfigService,
  NoctuaAnnotonFormService,
  AnnotonError,
  noctuaFormConfig,
  Article,
  NoctuaLookupService,
  withfrom
} from 'noctua-form-base';

import { withDropdownData } from './with-dropdown.tokens';
import { WithDropdownOverlayRef } from './with-dropdown-ref';
import { NoctuaFormDialogService } from 'app/main/apps/noctua-form';
import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'noc-with-dropdown',
  templateUrl: './with-dropdown.component.html',
  styleUrls: ['./with-dropdown.component.scss']
})

export class NoctuaWithDropdownComponent implements OnInit, OnDestroy {
  evidenceDBForm: FormGroup;
  formControl: FormControl;

  weeks = [];
  connectedTo = [];

  myForm: FormGroup;

  private _unsubscribeAll: Subject<any>;

  indata = {
    companies: [
      {
        projects: [
          {
            projectName: "WB:145787",
          }
        ]
      }
    ]
  }


  options: string[] = withfrom;
  filteredOptions: Observable<string[]>;



  constructor(private fb: FormBuilder, public dialogRef: WithDropdownOverlayRef,
    @Inject(withDropdownData) public data: any,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
  ) {
    this._unsubscribeAll = new Subject();
    this.formControl = data.formControl;

    this.myForm = this.fb.group({
      companies: this.fb.array([])
    });
    const withfroms = this.formControl.value;
    if (withfroms) {
      const groups = withfroms.split(',');
      const items = groups.map((group) => {
        return group.split('|');
      })
      console.log(items);

    }

    //this.setCompanies();



    this.weeks = [
      {
        id: 'week-1',
        weeklist: [
          "item 1",
          "item 2",
          "item 3",
          "item 4",
          "item 5"
        ]
      }, {
        id: 'week-2',
        weeklist: [
          "item 1",
          "item 2",
          "item 3",
          "item 4",
          "item 5"
        ]
      }
    ];
    for (let week of this.weeks) {
      this.connectedTo.push(week.id);
    };
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    this.evidenceDBForm = this._createEvidenceDBForm();
  }

  clearValues() {

  }

  addNewCompany() {
    let control = <FormArray>this.myForm.controls.companies;
    control.push(
      this.fb.group({
        company: [''],
        projects: this.fb.array([])
      })
    )
  }

  deleteCompany(index) {
    let control = <FormArray>this.myForm.controls.companies;
    control.removeAt(index)
  }

  addNewProject(control, value?) {
    const projectName = new FormControl(value);
    control.push(this.fb.group({ projectName: projectName }));

    this._onValueChange(projectName)
  }

  deleteProject(control, index) {
    control.removeAt(index)
  }

  setCompanies() {
    let control = <FormArray>this.myForm.controls.companies;
    this.indata.companies.forEach(x => {
      control.push(this.fb.group({
        projects: this.setProjects(x)
      }));
    })
  }

  setProjects(x) {
    let arr = new FormArray([]);
    x.projects.forEach(y => {
      this.addNewProject(arr, y.projectName);
    });
    return arr;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  save() {
    const self = this;
    const errors = [];
    let canSave = true;

    const withs = this.myForm.value.companies.map((project) => {
      return project.projects.map((item) => {
        if (!item.projectName.includes(':')) {
          const error = new AnnotonError('error', 1, `${item.projectName} wrong format, Did you forget ':'`);
          errors.push(error);
          canSave = false;
        }
        return item.projectName;
      }).join('|');
    }).join(',');

    console.log(withs);

    /*   if (accession.trim() === '') {
        const error = new AnnotonError('error', 1, `${db.name} accession is required`);
        errors.push(error);
        self.noctuaFormDialogService.openAnnotonErrorsDialog(errors);
        canSave = false;
      } */

    if (canSave) {
      this.formControl.setValue(withs);
      this.close();
    } else {
      self.noctuaFormDialogService.openAnnotonErrorsDialog(errors);
    }
  }

  cancelEvidenceDb() {
    this.evidenceDBForm.controls['accession'].setValue('');
  }

  private _createEvidenceDBForm() {
    return new FormGroup({
      db: new FormControl(this.noctuaFormConfigService.evidenceDBs.selected),
      accession: new FormControl('',
        [
          Validators.required,
        ])
    });
  }

  private _onValueChange(formControl: FormControl) {
    const self = this;

    this.filteredOptions = formControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        distinctUntilChanged(),
        debounceTime(400),
        startWith(''),
        map(value => this._filter(value))
      );
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
