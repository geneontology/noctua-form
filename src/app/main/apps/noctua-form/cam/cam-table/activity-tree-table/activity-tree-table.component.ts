import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { noctuaAnimations } from './../../../../../../../@noctua/animations';
import { NoctuaFormDialogService } from './../../../services/dialog.service';

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
  ActivityNode,
  compareNodeWeight,
} from '@geneontology/noctua-form-base';

import { EditorCategory } from '@noctua.editor/models/editor-category';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';
import { MatTableDataSource } from '@angular/material/table';
import { FlatTreeControl } from '@angular/cdk/tree';

@Component({
  selector: 'noc-activity-tree-table',
  templateUrl: './activity-tree-table.component.html',
  styleUrls: ['./activity-tree-table.component.scss'],
  animations: noctuaAnimations
})
export class ActivityTreeTableComponent implements OnInit, OnDestroy {
  EditorCategory = EditorCategory;
  ActivityType = ActivityType;
  activityTypeOptions = noctuaFormConfig.activityType.options;
  dataSource: MatTableDataSource<ActivityNode>;

  @ViewChild('tree') tree;

  @Input('cam')
  cam: Cam

  @Input('activity')
  activity: Activity

  @Input('options')
  options: any = {};

  gpNode: ActivityNode;
  treeControl = new FlatTreeControl<ActivityNode>(
    node => node.treeLevel, node => node.expandable);

  private unsubscribeAll: Subject<any>;

  constructor(
    public camService: CamService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaActivityEntityService: NoctuaActivityEntityService,
    public noctuaActivityFormService: NoctuaActivityFormService) {

    this.dataSource = new MatTableDataSource<ActivityNode>();
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.gpNode = this.activity.gpNode

    this.dataSource.data = this.activity.nodes.sort(compareNodeWeight);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  onTreeLoad() {
    this.tree.treeModel.expandAll();
  }

  hasChild = (_: number, node: ActivityNode) => node.expandable;


  toggleExpand(activity: Activity) {
    activity.expanded = !activity.expanded;
  }

  toggleNodeExpand(node: ActivityNode) {
    node.expanded = !node.expanded;
  }

  displayCamErrors() {
    const errors = this.cam.getViolationDisplayErrors();
    this.noctuaFormDialogService.openCamErrorsDialog(errors);
  }

  displayActivityErrors(activity: Activity) {
    const errors = activity.getViolationDisplayErrors();
    this.noctuaFormDialogService.openCamErrorsDialog(errors);
  }

  cleanId(dirtyId: string) {
    return NoctuaUtils.cleanID(dirtyId);
  }
}

