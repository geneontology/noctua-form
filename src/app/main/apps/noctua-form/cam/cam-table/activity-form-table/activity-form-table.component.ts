import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
  ActivityType,
  ActivityTreeNode,
  ActivityDisplayType,
  BbopGraphService
} from '@geneontology/noctua-form-base';

import {
  Cam,
  Activity,
  ActivityNode
} from '@geneontology/noctua-form-base';

import { EditorCategory } from '@noctua.editor/models/editor-category';
import { cloneDeep } from 'lodash';
import { InlineEditorService } from '@noctua.editor/inline-editor/inline-editor.service';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';
import { FlatTreeControl } from '@angular/cdk/tree';
import { takeUntil } from 'rxjs/operators';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { SettingsOptions } from '@noctua.common/models/graph-settings';
import { TableOptions } from '@noctua.common/models/table-options';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'noc-activity-form-table',
  templateUrl: './activity-form-table.component.html',
  styleUrls: ['./activity-form-table.component.scss'],
  animations: noctuaAnimations
})
export class ActivityFormTableComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  ActivityDisplayType = ActivityDisplayType;
  EditorCategory = EditorCategory;
  ActivityType = ActivityType;
  activityTypeOptions = noctuaFormConfig.activityType.options;



  settings: SettingsOptions = new SettingsOptions()
  gpSettings: SettingsOptions = new SettingsOptions()

  @ViewChild('tree') tree;
  @ViewChild('gpTree') gpTree;
  @Input('cam') cam: Cam
  @Input('activity') activity: Activity
  @Input('options') options: TableOptions = {};

  gpOptions: TableOptions = {};

  optionsDisplay: any = {}

  gpNode: ActivityNode;
  editableTerms = false;
  currentMenuEvent: any = {};

  descriptionSectionTitle = 'Function Description';
  annotatedSectionTitle = 'Gene Product';

  //Tree
  treeNodes: ActivityTreeNode[] = [];
  treeControl = new FlatTreeControl<ActivityNode>(
    node => node.treeLevel, node => node.expandable);

  gpTreeNodes: ActivityTreeNode[] = [];
  gpTreeControl = new FlatTreeControl<ActivityNode>(
    node => node.treeLevel, node => node.expandable);

  dataSource: MatTableDataSource<ActivityNode>;

  treeOptions = {
    allowDrag: false,
    allowDrop: false,
    // levelPadding: 15,
    getNodeClone: (node) => ({
      ...node.data,
      //id: uuid.v4(),
      name: `Copy of ${node.data.name}`
    })
  };

  private _unsubscribeAll: Subject<any>;

  constructor(
    public camService: CamService,
    private _bbopGraphService: BbopGraphService,
    private noctuaCommonMenuService: NoctuaCommonMenuService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaActivityEntityService: NoctuaActivityEntityService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    private inlineEditorService: InlineEditorService) {

    this.dataSource = new MatTableDataSource<ActivityNode>();
    this._unsubscribeAll = new Subject();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // do your action

  }

  ngOnInit(): void {
    this.loadTree()
    this.gpOptions = cloneDeep(this.options);
    this.gpOptions.showMenu = this.activity.activityType === ActivityType.molecule ||
      this.activity.activityType === ActivityType.proteinComplex;

    if (this.activity.activityType === ActivityType.ccOnly) {
      this.descriptionSectionTitle = 'Localization Description';
    } else if (this.activity.activityType === ActivityType.molecule) {
      this.annotatedSectionTitle = 'Small Molecule';
      this.descriptionSectionTitle = 'Location (optional)';
    } else {
      this.descriptionSectionTitle = 'Function Description';
    }

    this.noctuaCommonMenuService.onCamSettingsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((settings: SettingsOptions) => {
        if (!settings) {
          return;
        }
        this.settings = settings;
        this.gpSettings = cloneDeep(settings)
        this.gpSettings.showEvidence = false;
        this.gpSettings.showEvidenceSummary = false;
      });

    if (this.options?.editableTerms) {
      this.editableTerms = this.options.editableTerms
    }

    this._bbopGraphService.onCamGraphChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam: Cam) => {
        if (!cam || cam.id !== this.cam.id) {
          return;
        }
        this.cam = cam;
        this.activity = cam.findActivityById(this.activity.id)
        this.loadTree()
      })
  }

  ngAfterViewInit(): void {

    this.gpTree?.treeModel.filterNodes((node) => {
      const activityNode = node.data.node as ActivityNode;
      return (activityNode?.displaySection.id === noctuaFormConfig.displaySection.gp.id);
    });

    this.tree?.treeModel.filterNodes((node) => {
      const activityNode = node.data.node as ActivityNode;
      return (activityNode?.displaySection.id === noctuaFormConfig.displaySection.fd.id);
    });
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadTree() {
    if (!this.activity) return;
    this.gpNode = this.activity.gpNode;
    this.optionsDisplay = { ...this.options, hideHeader: true };
    this.treeNodes = this.activity.buildTrees();
    this.gpTreeNodes = this.activity.buildGPTrees();
  }

  onTreeLoad() {
    this.tree?.treeModel.expandAll();
  }

  onGPTreeLoad() {
    this.gpTree?.treeModel.expandAll();
  }

  setActivityDisplayType(displayType: ActivityDisplayType) {
    this.activity.activityDisplayType = displayType;
  }

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


  addEvidence(entity: ActivityNode) {
    const self = this;

    entity.predicate.addEvidence();
    const data = {
      cam: this.cam,
      activity: this.activity,
      entity: entity,
      category: EditorCategory.evidenceAll,
      evidenceIndex: entity.predicate.evidence.length - 1
    };

    this.camService.onCamChanged.next(this.cam);
    this.camService.activity = this.activity;
    this.noctuaActivityEntityService.initializeForm(this.activity, entity);
    this.inlineEditorService.open(this.currentMenuEvent.target, { data });

    self.noctuaActivityFormService.initializeForm();
  }


  cleanId(dirtyId: string) {
    return NoctuaUtils.cleanID(dirtyId);
  }
}

