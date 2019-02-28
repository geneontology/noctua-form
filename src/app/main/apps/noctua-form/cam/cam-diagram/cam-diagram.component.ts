
import { AfterViewInit, ViewChild, Component, OnInit, Input } from '@angular/core';
import { jsPlumb } from 'jsplumb';

import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, Subscription, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { noctuaAnimations } from '@noctua/animations';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';

import { takeUntil, startWith } from 'rxjs/internal/operators';

import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { forEach } from '@angular/router/src/utils/collection';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { NoctuaGraphService } from '@noctua.form/services/graph.service';
import { NoctuaLookupService } from '@noctua.form/services/lookup.service';
import { SummaryGridService } from '@noctua.form/services/summary-grid.service';

import { NoctuaFormService } from './../../services/noctua-form.service';
import { CamDiagramService } from './services/cam-diagram.service';
import { NoctuaFormDialogService } from './../../dialog.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { CamService } from '@noctua.form/services/cam.service'

import { Cam } from '@noctua.form/models/annoton/cam';
import { Annoton } from '@noctua.form/models/annoton/annoton';
import { AnnotonNode } from '@noctua.form/models/annoton/annoton-node';
import { Evidence } from '@noctua.form/models/annoton/evidence';


@Component({
  selector: 'noc-cam-diagram',
  templateUrl: './cam-diagram.component.html',
  styleUrls: ['./cam-diagram.component.scss']
})
export class CamDiagramComponent implements AfterViewInit, OnInit {
  title = 'Angular JsPlumb Integration';

  @Input('cam')
  public cam: Cam = new Cam();

  @ViewChild('leftDrawer')
  leftDrawer: MatDrawer;

  @ViewChild('rightDrawer')
  rightDrawer: MatDrawer;

  jsPlumbInstance;
  showConnectionToggle = false;
  buttonName = 'Connect';
  nodes = [];

  annoton: Annoton = new Annoton();

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private camService: CamService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaSearchService: NoctuaSearchService,
    //   public noctuaFormService: NoctuaFormService,
    public camDiagramService: CamDiagramService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaGraphService: NoctuaGraphService,
    private summaryGridService: SummaryGridService, ) {
    this.unsubscribeAll = new Subject();

  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event)
    let element = event.item.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    let parentPosition = this.getPosition(element);
    console.log('x: ' + (boundingClientRect.left - parentPosition.left), 'y: ' + (boundingClientRect.top - parentPosition.top));
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  getPosition(el) {
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y, left: x };
  }

  ngOnInit() {
    this.cam.onGraphChanged.subscribe((annotons) => {
      if (annotons) {
        let data = this.summaryGridService.getGrid(annotons);

        this.camService.addCamChildren(this.cam, data);
        console.log('poo', this.cam)
      }
    });

    this.camDiagramService.setLeftDrawer(this.leftDrawer);
    this.camDiagramService.setRightDrawer(this.rightDrawer);
  }

  ngAfterViewInit() {
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.jsPlumbInstance.draggable('Source');

    console.log("pppp")

  }

  addNode(name: string) {
    this.nodes = [name];
    console.log(this.nodes);
  }

  showConnectOnClick() {
    this.showConnectionToggle = !this.showConnectionToggle;
    if (this.showConnectionToggle) {
      this.buttonName = 'Dissconnect';
      this.connectSourceToTargetUsingJSPlumb();
    } else {
      this.buttonName = 'Connect';
      this.jsPlumbInstance.reset();
    }
  }

  connectSourceToTargetUsingJSPlumb() {
    let labelName;
    labelName = 'connection';
    this.jsPlumbInstance.connect({
      connector: ['Flowchart', { stub: [212, 67], cornerRadius: 1, alwaysRespectStubs: true }],
      source: 'Source',
      target: 'Target1',
      anchor: ['Right', 'Left'],
      paintStyle: { stroke: '#456', strokeWidth: 4 },
      overlays: [
        ['Label', { label: labelName, location: 0.5, cssClass: 'connectingConnectorLabel' }]
      ],
    });
  }
}
