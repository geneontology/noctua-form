import { ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import {
  NoctuaFormConfigService,
  NoctuaActivityFormService,
  NoctuaActivityEntityService,
  CamService,
  noctuaFormConfig,
  NoctuaUserService,
  ActivityType
} from '@geneontology/noctua-form-base';

import {
  Cam,
  Activity,
  ActivityNode
} from '@geneontology/noctua-form-base';

import { EditorCategory } from '@noctua.editor/models/editor-category';
import { takeUntil } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { NoctuaFormDialogService } from '../../noctua-form/services/dialog.service';

@Component({
  selector: 'noc-graph-activity-table',
  templateUrl: './activity-table.component.html',
  styleUrls: ['./activity-table.component.scss']
})
export class ActivityTableComponent implements OnInit, OnDestroy {
  EditorCategory = EditorCategory;
  ActivityType = ActivityType;
  activityTypeOptions = noctuaFormConfig.activityType.options;

  @Input('options') options: any = {};
  @Input('panelDrawer') panelDrawer: MatDrawer;
  @Input('cam') cam: Cam;

  activity: Activity

  gpNode: ActivityNode;
  nodes: ActivityNode[] = [];
  editableTerms = false;
  currentMenuEvent: any = {};

  private _unsubscribeAll: Subject<any>;

  constructor(
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    public camService: CamService,
    public noctuaCommonMenuService: NoctuaCommonMenuService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityEntityService: NoctuaActivityEntityService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    private confirmDialogService: NoctuaConfirmDialogService,
    private noctuaFormDialogService: NoctuaFormDialogService) {

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    const self = this;

    this.camService.onSelectedActivityChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((activity: Activity) => {
        if (!activity) {
          return;
        }
        this.activity = null

        setTimeout(() => {
          this.activity = activity
        }, 100);

      });

  }

  deleteActivity(activity: Activity) {
    const self = this;

    const success = () => {
      this.camService.deleteActivity(activity).then(() => {
        this.camService.onSelectedActivityChanged.next(null);
        this.noctuaCommonMenuService.closeRightDrawer();
        this.camService.getCam(this.cam.id);
        self.noctuaFormDialogService.openInfoToast('Activity successfully deleted.', 'OK');
      });
    };

    if (!self.noctuaUserService.user) {
      this.confirmDialogService.openConfirmDialog('Not Logged In',
        'Please log in to continue.',
        null);
    } else {
      this.confirmDialogService.openConfirmDialog('Confirm Delete?',
        'You are about to delete an activity.',
        success);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  close() {
    this.panelDrawer.close();
  }
}
