import { Injector } from '@angular/core';


import * as _ from 'lodash';
const each = require('lodash/forEach');

export class FormGridService {
  saeConstants;
  config
  $timeout
  lookup
  annoton;

  constructor(saeConstants, config, $timeout, lookup) {
    noctuaFormConfig = saeConstants
    this.config = config;
    this.$timeout = $timeout;
    this.lookup = lookup;
    this.annoton = this.config.createAnnotonModel(
      noctuaFormConfig.annotonType.options.simple.name,
      noctuaFormConfig.annotonModelType.options.default.name
    );

  }

  setAnnotonType(annoton, annotonType) {
    annoton.setAnnotonType(annotonType.name);



    this.annoton = this.config.createAnnotonModel(
      annotonType,
      annoton.annotonModelType,
      annoton
    )
    this.initalizeForm();
  }

  setAnnotonModelType(annoton, annotonModelType) {


    this.annoton = this.config.createAnnotonModel(
      annoton.annotonType,
      annotonModelType,
      annoton)
    this.initalizeForm();
  }

  getAnnotonPresentation(annoton) {


    let result = {
      geneProduct: annoton.getNode('gp'),
      mcNode: annoton.getNode('mc'),
      gp: {},
      fd: {},
      extra: []
    }

    each(annoton.nodes, function (node) {
      if (node.displaySection && node.displayGroup) {
        if (!result[node.displaySection.id][node.displayGroup.id]) {
          result[node.displaySection.id][node.displayGroup.id] = {
            shorthand: node.displayGroup.shorthand,
            label: node.displayGroup.label,
            nodes: []
          };
        }
        result[node.displaySection.id][node.displayGroup.id].nodes.push(node);
        node.nodeGroup = result[node.displaySection.id][node.displayGroup.id];
        if (node.isComplement) {
          node.nodeGroup.isComplement = true;
        }
      }
    });

    return result;

  }

  addAnnotonPresentation(annoton, displaySectionId) {
    let result = {};
    result[displaySectionId] = {};

    each(annoton.nodes, function (node) {
      if (node.displaySection === displaySectionId && node.displayGroup) {
        if (!result[displaySectionId][node.displayGroup.id]) {
          result[displaySectionId][node.displayGroup.id] = {
            shorthand: node.displayGroup.shorthand,
            label: node.displayGroup.label,
            nodes: []
          };
        }
        result[displaySectionId][node.displayGroup.id].nodes.push(node);
        node.nodeGroup = result[displaySectionId][node.displayGroup.id];
        if (node.isComplement) {
          node.nodeGroup.isComplement = true;
        }
      }
    });

    this.annotonPresentation.extra.push(result);

    return result[displaySectionId];

  }


  /**
   *  Populates the grid with GO Terms, MF, CC, BP as roots
   */
  initalizeForm() {


    this.annotonPresentation = this.getAnnotonPresentation(this.annoton);

  }

  addGPNode(annoton) {


    let id = 'gp-' + annoton.nodes.length;

    this.config.addGPAnnotonData(annoton, id);
  }

  initalizeFormData() {


    this.annoton = this.config.createAnnotonModelFakeData();
    this.initalizeForm()

  }

  linkFormNode(entity, srcNode) {


    entity.modelId = srcNode.modelId;
    entity.setTerm(srcNode.getTerm());
  }

  cloneForm(srcAnnoton, filterNodes) {


    this.annoton = this.config.createAnnotonModel(
      srcAnnoton.annotonType,
      srcAnnoton.annotonModelType
    );

    if (filterNodes) {
      each(filterNodes, function (srcNode) {

        //this.complexAnnotonData.geneProducts = srcAnnoton.complexAnnotonData.geneProducts;
        // this.complexAnnotonData.mcNode.copyValues(srcAnnoton.complexAnnotonData.mcNode);

        let destNode = this.annoton.getNode(srcNode.id);
        if (destNode) {
          destNode.copyValues(srcNode);
        }
      })
    } else {
      this.annoton.copyValues(srcAnnoton);
    }

    this.initalizeForm();
  }


  clearForm() {


    this.annoton = this.config.createAnnotonModel(
      this.annoton.annotonType,
      this.annoton.annotonModelType
    )
    this.initalizeForm();
  }
}
