import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ViewChildren, QueryList, Input } from '@angular/core';
import * as joint from 'jointjs';
import { CamGraphService } from './services/cam-graph.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { NoctuaDataService } from '@noctua.common/services/noctua-data.service';
import { Activity, Cam, CamOperation, NoctuaFormConfigService, BbopGraphService } from '@geneontology/noctua-form-base';
import { NoctuaShapesService } from '@noctua.graph/services/shapes.service';
import { noctuaStencil } from '@noctua.graph/data/cam-stencil';
import { NoctuaGraphEditorService } from '@noctua.graph/services/graph-editor-service';

@Component({
  selector: 'noc-cam-graph',
  templateUrl: './cam-graph.component.html',
  styleUrls: ['./cam-graph.component.scss']
})
export class CamGraphComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren('stencils') stencilContainers: QueryList<any>;

  @Input('cam')
  public cam: Cam;

  private _unsubscribeAll: Subject<any>;
  stencils = [];

  selectedLayoutDetail;

  constructor(
    public noctuaDataService: NoctuaDataService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaGraphEditorService: NoctuaGraphEditorService,
    // public noctuaCamEditorService: NoctuaCamEditorService,
    private _bbopGraphService: BbopGraphService,
    public noctuaCommonMenuService: NoctuaCommonMenuService,
    public noctuaCamGraphService: CamGraphService,
    private noctuaCamShapesService: NoctuaShapesService) {

    this._unsubscribeAll = new Subject();

    this.stencils = noctuaStencil.camStencil

    this.noctuaGraphEditorService.onGraphLayoutDetailChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((layoutDetail) => {
        if (!layoutDetail) {
          return;
        }

        this.noctuaCamGraphService.addToCanvas(this.cam, this.noctuaGraphEditorService.selectedGraphLayoutDetail.id);

      });

  }

  ngAfterViewInit() {
    const self = this;

    self.noctuaCamGraphService.initializeGraph();
    self.noctuaCamGraphService.initializeStencils();

    self._bbopGraphService.onCamGraphChanged
      .pipe(takeUntil(self._unsubscribeAll))
      .subscribe((cam: Cam) => {
        if (!cam || cam.id !== self.cam.id) {
          return;
        }
        self.cam = cam;
        self.noctuaCamGraphService.cam = self.cam;
        if (cam.operation !== CamOperation.ADD_ACTIVITY) {
          self.noctuaCamGraphService.addToCanvas(self.cam, this.noctuaGraphEditorService.selectedGraphLayoutDetail.id);
        }

      });
  }

  ngOnInit() {
    const self = this;

    self._bbopGraphService.onActivityAdded
      .pipe(takeUntil(self._unsubscribeAll))
      .subscribe((activity: Activity) => {
        if (!activity) {
          return;
        }
        //self.noctuaCamGraphService.cam.activities.push(activity)
        self.noctuaCamGraphService.addActivity(activity, this.noctuaGraphEditorService.selectedGraphLayoutDetail.id);

      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  selectLayoutDetail(selected) {
    this.noctuaGraphEditorService.selectedGraphLayoutDetail = selected;
    this.noctuaGraphEditorService.onGraphLayoutDetailChanged.next(selected)
  }

  canMove(e: any): boolean {
    return e.indexOf('Disabled') === -1;
  }

  automaticLayout() {
    this.noctuaCamGraphService.autoLayoutGraph();
  }

  zoomIn() {
    const delta = 0.1;
    this.noctuaCamGraphService.zoom(delta);
  }

  zoomOut() {
    const delta = -0.1;
    this.noctuaCamGraphService.zoom(delta);
  }

  onCtrlScroll($event) {
    const self = this;
    const delta = Math.max(-1, Math.min(1, ($event.wheelDelta || $event.detail))) / 10;

    if ($event.ctrlKey) {
      self.noctuaCamGraphService.zoom(delta, $event);
      $event.returnValue = false;
      // for Chrome and Firefox
      if ($event.preventDefault) {
        $event.preventDefault();
      }
    }
  }

}
