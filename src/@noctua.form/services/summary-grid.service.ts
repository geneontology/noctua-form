import { Injectable } from '@angular/core';
//Config
import { noctuaFormConfig } from './../noctua-form-config';
import { NoctuaFormConfigService } from './config/noctua-form-config.service';
import { NoctuaLookupService } from './lookup.service';


import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { Annoton } from '@noctua.form/models/annoton/annoton';
import { AnnotonNode } from '@noctua.form/models/annoton/annoton-node';

@Injectable({
  providedIn: 'root'
})
export class SummaryGridService {

  constructor(private noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService) {

  }

  getGrid(annotons: Annoton[]) {
    const self = this;
    let gridData = [];

    each(annotons, function (annoton, key) {
      each(annoton.annotonPresentation.fd, function (nodeGroup) {
        each(nodeGroup.nodes, function (node) {
          let term = node.getTerm();

          if (node.id !== 'mc' && node.id !== 'gp' && term.id) {
            self.getGridRow(annoton, node, gridData);
          }
        });
      });
    });
    return gridData;
  }

  getGridRow(annoton: Annoton, node: AnnotonNode, gridData) {
    const self = this;

    let extension = node.treeLevel > 1;
    let term = node.getTerm();

    gridData.push({
      displayEnabledBy: self.tableCanDisplayEnabledBy(node),
      treeLevel: node.treeLevel,
      gp: self.tableDisplayGp(annoton, node),
      relationship: extension ? '' : self.tableDisplayExtension(node),
      relationshipExt: extension ? node.relationship.label : '',
      term: extension ? {} : term,
      extension: extension ? term : {},
      aspect: node.aspect,
      evidence: node.evidence[0].evidence.control.value,
      reference: node.evidence[0].reference.control.link,
      with: node.evidence[0].with.control.value,
      assignedBy: node.evidence[0].assignedBy.control,
      node: node,
      annoton: annoton
      // $$treeLevel: node.treeLevel,

    })

    for (let i = 1; i < node.evidence.length; i++) {
      gridData.push({
        treeLevel: node.treeLevel,
        evidence: node.evidence[i].evidence.control.value,
        reference: node.evidence[i].reference.control.link,
        with: node.evidence[i].with.control.value,
        assignedBy: node.evidence[i].assignedBy.control,
        node: node,
        annoton: annoton
      })
    }

  }

  tableDisplayGp(annoton: Annoton, node: AnnotonNode) {
    const self = this;

    let display = false;

    switch (annoton.annotonModelType) {
      case noctuaFormConfig.annotonModelType.options.default.name:
      case noctuaFormConfig.annotonModelType.options.bpOnly.name:
        display = node.id === 'mf';
        break;
      case noctuaFormConfig.annotonModelType.options.ccOnly.name:
        display = node.id === 'cc';
        break;
    }
    return display ? annoton.gp : '';
  }

  tableCanDisplayEnabledBy(node: AnnotonNode) {
    const self = this;

    return node.relationship.id === noctuaFormConfig.edge.enabledBy.id
  }

  tableDisplayExtension(node: AnnotonNode) {
    const self = this;

    if (node.id === 'mf') {
      return '';
    } else if (node.isComplement) {
      return 'NOT ' + node.relationship.label;
    } else {
      return node.relationship.label;
    }
  }
}
