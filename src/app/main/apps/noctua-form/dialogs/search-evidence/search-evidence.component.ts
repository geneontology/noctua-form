
import { Component, OnInit, OnDestroy, Inject, Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, BehaviorSubject } from 'rxjs';

import {
  AnnotonNode,
  Evidence,
  NoctuaFormConfigService,
  NoctuaLookupService
} from 'noctua-form-base';

import { noctuaAnimations } from './../../../../../../@noctua/animations';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { each } from 'lodash';

export class EvidenceItemNode {
  annotonNode: AnnotonNode;
  evidence: Evidence;
  id: number;
  level: number;
  expandable: boolean;
  children: EvidenceItemNode[];
}

export class EvidenceItemFlatNode {
  public id: number;
  public annotonNode: AnnotonNode;
  public evidence: Evidence;
  public expandable: boolean;
  public level: number;
  public count = 0;
}

@Component({
  selector: 'app-search-evidence',
  templateUrl: './search-evidence.component.html',
  styleUrls: ['./search-evidence.component.scss'],
  animations: noctuaAnimations
})
export class SearchEvidenceDialogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  annotonNodes: AnnotonNode[] = [];
  searchCriteria: any;
  selection = new SelectionModel<Evidence>(true, []);

  /** A selected parent node to be inserted */
  selectedParent: EvidenceItemFlatNode | null = null;
  treeControl: FlatTreeControl<EvidenceItemFlatNode>;
  treeFlattener: MatTreeFlattener<EvidenceItemNode, EvidenceItemFlatNode>;
  dataSource: MatTreeFlatDataSource<EvidenceItemNode, EvidenceItemFlatNode>;
  checklistSelection = new SelectionModel<EvidenceItemFlatNode>(true /* multiple */);

  constructor(
    private _matDialogRef: MatDialogRef<SearchEvidenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService,
  ) {
    this._unsubscribeAll = new Subject();

    this.searchCriteria = this._data.searchCriteria;



  }
  ngOnInit() {
    this.initialize();

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);
    this.treeControl = new FlatTreeControl<EvidenceItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  }

  initialize() {
    const self = this;

    self.noctuaLookupService.companionLookup(
      this.searchCriteria.gpNode.id,
      this.searchCriteria.aspect,
      this.searchCriteria.params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        console.log(response);
        this.annotonNodes = response;
        this.dataSource.data = this._buildAnnotationTree(this.annotonNodes);

        console.log(this.dataSource.data);

      });
  }

  save() {
    console.log(this.checklistSelection.selected);
    const selection: Evidence[] = [];

    each(this.checklistSelection.selected, (evidenceFlatNode: EvidenceItemFlatNode) => {
      if (evidenceFlatNode.evidence) {
        selection.push(evidenceFlatNode.evidence);
      }
    });

    this._matDialogRef.close({
      evidences: selection
    });
  }

  close() {
    this._matDialogRef.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getLevel = (node: EvidenceItemFlatNode) => node.level;
  isExpandable = (node: EvidenceItemFlatNode) => node.expandable;
  getChildren = (node: EvidenceItemNode): EvidenceItemNode[] => node.children;
  hasChild = (_: number, _nodeData: EvidenceItemFlatNode) => _nodeData.expandable;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: EvidenceItemNode, level: number) => {
    const flatNode = new EvidenceItemFlatNode();
    flatNode.annotonNode = node.annotonNode;
    flatNode.evidence = node.evidence;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.count = node.children ? node.children.length : 0;
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: EvidenceItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: EvidenceItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  evidenceItemSelectionToggle(node: EvidenceItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  evidenceLeafItemSelectionToggle(node: EvidenceItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: EvidenceItemFlatNode): void {
    let parent: EvidenceItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: EvidenceItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: EvidenceItemFlatNode): EvidenceItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }


  private _buildAnnotationTree(annotonNodes: AnnotonNode[]): EvidenceItemNode[] {
    const result = annotonNodes.map((annotonNode: AnnotonNode) => {
      const node = new EvidenceItemNode();
      node.annotonNode = annotonNode;

      node.children = annotonNode.predicate.evidence.map((evidence: Evidence) => {
        const evidenceNode = new EvidenceItemNode();
        evidenceNode.evidence = evidence;
        return evidenceNode;
      });

      return node;
    });

    return result;

  }

  /*   buildFileTree(obj: { [key: string]: any }, level: number): EvidenceItemNode[] {
      return Object.keys(obj).reduce<EvidenceItemNode[]>((accumulator, key) => {
        const value = obj[key];
        const node = new EvidenceItemNode();
        node.item = key;
  
        if (value != null) {
          if (typeof value === 'object') {
            node.children = this.buildFileTree(value, level + 1);
          } else {
            node.item = value;
          }
        }
  
        return accumulator.concat(node);
      }, []);
    }*/
}

/**
 * Node for to-do item
 */


/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null
    }
  },
  Reminders: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};

