
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { noctuaAnimations } from '@noctua/animations';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';

import { takeUntil } from 'rxjs/internal/operators';
import { forEach } from '@angular/router/src/utils/collection';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { locale as english } from './../i18n/en';
import { TreeNode } from 'primeng/api';


import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'app-review-treeview',
  templateUrl: './review-treeview.component.html',
  styleUrls: ['./review-treeview.component.scss'],
  animations: noctuaAnimations
})
export class ReviewTreeviewComponent implements OnInit, OnDestroy {

  searchCriteria: any = {};
  searchForm: FormGroup;

  cams: any[] = [];

  files1: TreeNode[];
  //files2: TreeNode[];

  cols: any[];

  files2: TreeNode[] = [{
    "data":
      [
        {
          "data": {
            "name": "Documents",
            "size": "75kb",
            "type": "Folder"
          },
          "children": [
            {
              "data": {
                "name": "Work",
                "size": "55kb",
                "type": "Folder"
              },
              "children": [
                {
                  "data": {
                    "name": "Expenses.doc",
                    "size": "30kb",
                    "type": "Document"
                  }
                },
                {
                  "data": {
                    "name": "Resume.doc",
                    "size": "25kb",
                    "type": "Resume"
                  }
                }
              ]
            },
            {
              "data": {
                "name": "Home",
                "size": "20kb",
                "type": "Folder"
              },
              "children": [
                {
                  "data": {
                    "name": "Invoices",
                    "size": "20kb",
                    "type": "Text"
                  }
                }
              ]
            }
          ]
        },
        {
          "data": {
            "name": "Pictures",
            "size": "150kb",
            "type": "Folder"
          },
          "children": [
            {
              "data": {
                "name": "barcelona.jpg",
                "size": "90kb",
                "type": "Picture"
              }
            },
            {
              "data": {
                "name": "primeui.png",
                "size": "30kb",
                "type": "Picture"
              }
            },
            {
              "data": {
                "name": "optimus.jpg",
                "size": "30kb",
                "type": "Picture"
              }
            }
          ]
        }
      ]
  }]

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private sparqlService: SparqlService,
    private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
    this.noctuaTranslationLoader.loadTranslations(english);
    this.searchForm = this.createAnswerForm();

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    //    this.nodeService.getFilesystem().then(files => this.files1 = files);
    //   this.nodeService.getFilesystem().then(files => this.files2 = files);

    /*

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'size', header: 'Size' },
      { field: 'type', header: 'Type' }
    ];
*/

    this.cols = [
      //  { field: 'expand', header: '' },
      { field: 'model', header: 'Model' },
      { field: 'annotatedEntity', header: 'Annotated Entity' },
      { field: 'relationship', header: 'Relationship' },
      { field: 'aspect', header: 'Asp' },
      { field: 'term', header: 'Term' },
      { field: 'relationshipExt', header: '' },
      { field: 'extension', header: 'Ext' },
      { field: 'evidence', header: 'Evidence' },
      { field: 'reference', header: 'Reference' },
      { field: 'with', header: 'With' },
      { field: 'assignedBy', header: 'Assigned By' }

    ]


    this.sparqlService.getCamsGoTerms('GO:0099160').subscribe((response: any) => {
      this.cams = this.sparqlService.cams = response;
      this.sparqlService.onCamsChanged.next(this.cams);
      this.loadCams();
    });

    this.sparqlService.onCamsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(cams => {
        this.cams = cams;
        this.loadCams();
      });
  }

  createAnswerForm() {
    return new FormGroup({
      goTerm: new FormControl(this.searchCriteria.goTerm),
      geneProduct: new FormControl(this.searchCriteria.geneProduct),
      pmid: new FormControl(this.searchCriteria.pmid),
    });
  }

  loadCams() {
    this.cams = this.sparqlService.cams;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
