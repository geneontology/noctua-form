

import { Component, OnDestroy, OnInit, Input, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { EMPTY, Subject } from 'rxjs';


import {
  Cam,
  ActivityType,
  NoctuaUserService,
  NoctuaFormConfigService,
  NoctuaFormMenuService,
  NoctuaActivityFormService,
  noctuaFormConfig,
  CamsService,
  ActivityNode,
  EntityLookup,
  NoctuaLookupService,
  EntityDefinition,
  Entity,
  Evidence,
  NoctuaGraphService,
  CamLoadingIndicator
} from 'noctua-form-base';

import { takeUntil, distinctUntilChanged, debounceTime, take, concatMap, finalize } from 'rxjs/operators';
import { noctuaAnimations } from '@noctua/animations';
import { FormGroup, FormControl } from '@angular/forms';
import { NoctuaReviewSearchService } from '@noctua.search/services/noctua-review-search.service';
import { cloneDeep, each, groupBy } from 'lodash';
import { ArtReplaceCategory } from '@noctua.search/models/review-mode';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { InlineReferenceService } from '@noctua.editor/inline-reference/inline-reference.service';

@Component({
  selector: 'noc-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss'],
  animations: noctuaAnimations,
})
export class ReviewFormComponent implements OnInit, OnDestroy {
  ActivityType = ActivityType;
  ArtReplaceCategory = ArtReplaceCategory;
  searchForm: FormGroup;
  cams: Cam[] = [];
  displayReplaceForm = {
    replaceSection: false,
    replaceActions: false
  };
  noctuaFormConfig = noctuaFormConfig;
  categories: any;
  findNode: ActivityNode;
  replaceNode: ActivityNode;
  gpNode: ActivityNode;
  termNode: ActivityNode;
  selectedCategory;

  textboxDetail = {
    placeholder: ''
  }

  private _unsubscribeAll: Subject<any>;

  constructor(
    private zone: NgZone,
    private camsService: CamsService,
    private noctuaGraphService: NoctuaGraphService,
    private confirmDialogService: NoctuaConfirmDialogService,
    public noctuaReviewSearchService: NoctuaReviewSearchService,
    public noctuaUserService: NoctuaUserService,
    private noctuaLookupService: NoctuaLookupService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    public noctuaFormMenuService: NoctuaFormMenuService,
    private inlineReferenceService: InlineReferenceService,) {

    this._unsubscribeAll = new Subject();
    this.categories = cloneDeep(this.noctuaFormConfigService.findReplaceCategories);
    this.camsService.onCamsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cams => {
        if (!cams) {
          return;
        }
        this.cams = cams;
      });

    this.gpNode = EntityDefinition.generateBaseTerm([
      EntityDefinition.GoMolecularEntity,
      // EntityDefinition.GoChemicalEntity
    ]);
    this.termNode = EntityDefinition.generateBaseTerm([
      EntityDefinition.GoMolecularFunction,
      EntityDefinition.GoBiologicalProcess,
      EntityDefinition.GoCellularComponent,
      EntityDefinition.GoBiologicalPhase,
      EntityDefinition.GoAnatomicalEntity,
      EntityDefinition.GoCellTypeEntity
    ]);
  }

  ngOnInit(): void {
    this.selectedCategory = this.categories.selected;
    this.resetForm(this.selectedCategory);

    this.noctuaReviewSearchService.onClearForm
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(clear => {
        if (!clear) {
          return;
        }
        this.clearFind();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  resetForm(selectedCategory): void {
    this.searchForm = this.createSearchForm(selectedCategory);
    this.noctuaReviewSearchService.clear();
    this.camsService.clearHighlight();

    this.calculateEnableReplace(this.selectedCategory);
    this.onValueChanges();
    this.onNodeValueChange(selectedCategory)
  }

  resetTermNode() {
    this.termNode = EntityDefinition.generateBaseTerm([
      EntityDefinition.GoMolecularFunction,
      EntityDefinition.GoBiologicalProcess,
      EntityDefinition.GoCellularComponent,
      EntityDefinition.GoBiologicalPhase,
      EntityDefinition.GoAnatomicalEntity,
      EntityDefinition.GoCellTypeEntity
    ]);
  }

  createSearchForm(selectedCategory) {
    this.selectedCategory = selectedCategory;
    return new FormGroup({
      findWhat: new FormControl(),
      replaceWith: new FormControl(),
      category: new FormControl(selectedCategory),
    });
  }

  getClosure(rootTypes: Entity[]) {
    const range = [
      EntityDefinition.GoMolecularEntity,
      EntityDefinition.GoMolecularFunction,
      EntityDefinition.GoBiologicalProcess,
      EntityDefinition.GoCellularComponent,
      EntityDefinition.GoBiologicalPhase,
      EntityDefinition.GoAnatomicalEntity,
      EntityDefinition.GoCellTypeEntity,
      EntityDefinition.GoProteinContainingComplex,
      //EntityDefinition.GoChemicalEntity,
      EntityDefinition.GoOrganism,
      EntityDefinition.GoEvidence
    ];

    const closures = range.filter(closure => {
      return rootTypes.find(rootType => rootType.id === closure.category);
    });

    return closures;
  }

  search(findWhat) {
    let filterType: string;
    this.noctuaReviewSearchService.clear();

    if (this.selectedCategory.name === noctuaFormConfig.findReplaceCategory.options.term.name) {
      filterType = this.noctuaReviewSearchService.filterType.terms;
    } else if (this.selectedCategory.name === noctuaFormConfig.findReplaceCategory.options.gp.name) {
      filterType = this.noctuaReviewSearchService.filterType.gps;
    } else if (this.selectedCategory.name === noctuaFormConfig.findReplaceCategory.options.reference.name) {
      filterType = this.noctuaReviewSearchService.filterType.pmids;
    }

    this.noctuaReviewSearchService.searchCriteria[filterType] = [findWhat];
    this.noctuaReviewSearchService.updateSearch();
  }

  openAddReference(event, name: string) {

    const data = {
      formControl: this.searchForm.controls[name] as FormControl,
    };
    this.inlineReferenceService.open(event.target, { data });

  }

  replace() {
    const self = this;
    const value = this.searchForm.value;
    let replaceWith = value.replaceWith;

    const cams = self.camsService.getReplaceObject([this.noctuaReviewSearchService.currentMatchedEnity],
      replaceWith, self.selectedCategory);

    self.replaceCams(cams);
  }

  replaceAll() {
    const self = this;
    const value = this.searchForm.value;
    const groupedEntities = groupBy(
      this.noctuaReviewSearchService.matchedEntities,
      'modelId') as { string: Entity[] };
    const models = Object.keys(groupedEntities).length;
    const occurrences = this.noctuaReviewSearchService.matchedCount;
    let replaceWith = value.replaceWith;

    const success = (replace) => {
      if (replace) {
        const cams = self.camsService.getReplaceObject(this.noctuaReviewSearchService.matchedEntities,
          replaceWith, self.selectedCategory);

        self.camsService.resetLoading(cams, new CamLoadingIndicator(true, 'Loading...'))
        self.replaceCams(cams);
      }
    };

    this.confirmDialogService.openConfirmDialog('Confirm ReplaceAll?',
      `Replace ${occurrences} occurrences across ${models} model(s)`,
      success);
  }

  findNext() {
    this.noctuaReviewSearchService.findNext();
  }

  findPrevious() {
    this.noctuaReviewSearchService.findPrevious();
  }

  goto(step: 'first' | 'last') {
    this.noctuaReviewSearchService.goto(step);
  }

  findSelected(value: any) {
    const closures = this.getClosure(value.rootTypes);
    this.findNode!.termLookup.results = []

    if (closures) {
      this.replaceNode = EntityDefinition.generateBaseTerm(closures);
    }

    const findWhat = this.searchForm.value.findWhat;
    this.search(findWhat);

    this.searchForm.patchValue({
      replaceWith: null
    });
  }

  termDisplayFn(term): string | undefined {
    return term && term.id ? `${term.label} (${term.id})` : undefined;
  }

  clearFind() {
    const self = this;
    self.searchForm.patchValue({
      findWhat: null,
      replaceWith: null
    });
    self.noctuaReviewSearchService.clear();
    self.camsService.clearHighlight();

    self.calculateEnableReplace(self.selectedCategory);
  }

  clearReplace() {
    const self = this;
    self.searchForm.patchValue({
      replaceWith: null
    });

    self.calculateEnableReplace(self.selectedCategory);
  }

  onValueChanges() {
    const self = this;

    this.searchForm.get('category').valueChanges.pipe(
      takeUntil(this._unsubscribeAll),
      distinctUntilChanged(),
    ).subscribe(data => {
      if (data) {
        self.selectedCategory = data;
        self.searchForm.patchValue({
          findWhat: null,
          replaceWith: null
        });

        self.calculateEnableReplace(self.selectedCategory);
        self.resetForm(data)
      }
    });
  }

  onNodeValueChange(selectedCategory) {
    const self = this;
    const lookupFunc = self.noctuaLookupService.lookupFunc();

    if (selectedCategory.name === noctuaFormConfig.findReplaceCategory.options.term.name) {
      self.findNode = self.termNode;
      self.textboxDetail.placeholder = 'Ontology Term'
    } else if (selectedCategory.name === noctuaFormConfig.findReplaceCategory.options.gp.name) {
      self.findNode = self.gpNode;
      self.textboxDetail.placeholder = 'Gene Product'
    } else if (selectedCategory.name === noctuaFormConfig.findReplaceCategory.options.reference.name) {
      self.findNode = null;
      self.textboxDetail.placeholder = 'Reference'
    }

    if (self.findNode) {
      this.findNode.termLookup.results = []
      this.searchForm.get('findWhat').valueChanges.pipe(
        takeUntil(this._unsubscribeAll),
        distinctUntilChanged(),
        debounceTime(400)
      ).subscribe(data => {
        if (data) {
          const lookup: EntityLookup = self.findNode.termLookup;
          lookupFunc.termLookup(data, lookup.requestParams).subscribe(response => {
            lookup.results = response;
          });

          self.searchForm.patchValue({
            replaceWith: null
          });

          self.calculateEnableReplace(selectedCategory);
        }
      });

      this.searchForm.get('replaceWith').valueChanges.pipe(
        takeUntil(this._unsubscribeAll),
        distinctUntilChanged(),
        debounceTime(400)
      ).subscribe(data => {
        if (data && self.replaceNode) {
          const lookup: EntityLookup = self.replaceNode.termLookup;
          lookupFunc.termLookup(data, lookup.requestParams).subscribe(response => {
            lookup.results = response;
          });

          self.calculateEnableReplace(selectedCategory);
        }
      });
    } else {
      this.searchForm.get('findWhat').valueChanges.pipe(
        takeUntil(this._unsubscribeAll),
        distinctUntilChanged(),
        debounceTime(1000)
      ).subscribe(data => {
        if (data && data.includes(':')) {
          if (Evidence.checkReference) {
            const findWhat = Evidence.formatReference(data);
            self.search(findWhat);
            self.calculateEnableReplace(selectedCategory);
          }
        }
      });

      this.searchForm.get('replaceWith').valueChanges.pipe(
        takeUntil(this._unsubscribeAll),
        distinctUntilChanged(),
        debounceTime(400)
      ).subscribe(data => {
        if (data && data.includes(':')) {
          self.calculateEnableReplace(selectedCategory);
        }
      });
    }
  }

  calculateEnableReplace(selectedCategory) {
    const self = this;

    const value = self.searchForm.value;
    const findWhat = value.findWhat;
    const replaceWith = value.replaceWith;

    if (selectedCategory.name === noctuaFormConfig.findReplaceCategory.options.reference.name) {
      self.displayReplaceForm.replaceSection = findWhat && Evidence.checkReference(findWhat);
      self.displayReplaceForm.replaceActions = replaceWith && Evidence.checkReference(replaceWith);
    } else {
      self.displayReplaceForm.replaceSection = findWhat && findWhat.id;
      self.displayReplaceForm.replaceActions = replaceWith && replaceWith.id;
    }
  }

  compareCategory(a: any, b: any) {
    if (a && b) {
      return (a.name === b.name);
    }
    return false;
  }

  private replaceCams(cams: Cam[]) {
    const self = this;

    this.camsService.replace(cams).pipe(
      take(1),
      concatMap((result) => {
        return EMPTY;
        //return self.camsService.bulkStoredModel(cams)
      }),
      finalize(() => {
        self.zone.run(() => {
          self.camsService.resetLoading(cams)
          self.noctuaReviewSearchService.onReplaceChanged.next(true);
          self.camsService.reviewChanges();
        })
      }))
      .subscribe(() => {

      })
  }

}
