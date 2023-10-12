import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Cam,
  CamService,
  Contributor,
  NoctuaActivityFormService,
  NoctuaFormConfigService,
  BbopGraphService,
  NoctuaUserService
} from '@geneontology/noctua-form-base';
import { NoctuaSearchDialogService } from '@noctua.search/services/dialog.service';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-noctua-pathway',
  templateUrl: './noctua-pathway.component.html',
  styleUrls: ['./noctua-pathway.component.scss']
})
export class NoctuaPathwayComponent implements OnInit, OnDestroy {
  cam: Cam;
  modelId: string;
  private _unsubscribeAll: Subject<any>;
  constructor(
    private route: ActivatedRoute,
    private camService: CamService,
    private _bbopGraphService: BbopGraphService,
    public noctuaSearchDialogService: NoctuaSearchDialogService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
  ) {

    this._unsubscribeAll = new Subject();

    this.route
      .queryParams
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.modelId = params['model_id'] || null;
        const baristaToken = params['barista_token'] || null;
        this.noctuaUserService.getUser(baristaToken);
      });

    this.noctuaUserService.onUserChanged.pipe(
      distinctUntilChanged(this.noctuaUserService.distinctUser),
      takeUntil(this._unsubscribeAll))
      .subscribe((user: Contributor) => {

        if (user === undefined) return;

        this.noctuaFormConfigService.setupUrls();
        this.noctuaFormConfigService.setUniversalUrls();
        this.loadCam(this.modelId);
      });
  }

  ngOnInit(): void {
    const self = this;
    this._bbopGraphService.onCamGraphChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam: Cam) => {
        if (!cam || cam.id !== self.cam.id) {
          return;
        }
        this.cam = cam;

        if (cam.activities.length > 0) {
          this.camService.addCamEdit(this.cam)
          this.camService.cams = [cam]
        }
        //this.noctuaReviewSearchService.addCamsToReview([this.cam], this.camService.cams);

      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadCam(modelId) {
    this.cam = this.camService.getCam(modelId);
  }

}
