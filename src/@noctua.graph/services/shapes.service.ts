import { Injectable } from '@angular/core';
import * as jQuery from 'jquery';
import 'jqueryui';
import * as _ from 'lodash';
import * as joint from 'jointjs';
import * as shapes from './../models/shapes';
import * as listShape from './../models/shapes/list';
import * as Backbone from 'backbone';
import { getColor } from '@noctua.common/data/noc-colors';
import { LIST_GROUP_NAME, LIST_ITEM_WIDTH } from './../models/shapes/list';

export class StencilNode extends shapes.StencilNode {

  setColor(colorKey: string): this {
    const self = this;
    const deep = getColor(colorKey, 800);
    const light = getColor(colorKey, 100);

    self.attr('body/stroke', light);
    self.attr('statusLine/fill', deep);
    self.attr('statusType/fill', deep);
    self.attr('iconBackground/fill', light);

    return this;
  }

  setIcon(iconUrl: string) {
    const self = this;

    if (iconUrl) {
      self.attr('icon/xlink:href', `${iconUrl}`);
    }

    return this;
  }
}

export class NodeCell extends shapes.NodeCell {

  addNodePorts(): this {
    const self = this;

    return this;
  }

  addColor(colorKey: string): this {
    const self = this;
    const deep = getColor(colorKey, 800);
    const light = getColor(colorKey, 100);

    self.attr('body/stroke', light);
    self.attr('statusLine/fill', deep);
    self.attr('statusType/fill', deep);

    return this;
  }


  hover(on: boolean): this {
    const self = this;
    self.attr('wrapper/strokeWidth', on ? 20 : 0);

    return this;
  }
}

export class NodeCellList extends listShape.NodeCellList {

  constructor() {
    super();
  }

  addHeader(label: string) {
    this.attr('label/text', label);
  }

  addEntity(relationship: string, term: string, hasEvidence) {
    const attrs: any = {}

    if (relationship) {
      attrs.relationship = { text: relationship }
      attrs.portLabel = { text: term }

      if (!hasEvidence) {
        attrs.portLabel.x = 75;
      }
    } else {
      attrs.relationship = { visibility: 'hidden' };
      attrs.portLabel = {
        text: term,
        x: hasEvidence ? 8 : 25,
        width: LIST_ITEM_WIDTH,
        textWrap: {
          width: LIST_ITEM_WIDTH - 16,
        },
      }
    }

    if (!hasEvidence) {
      attrs.noEvidence = { visibility: 'visible' }
      attrs.textWrap = {
        width: LIST_ITEM_WIDTH - 50,
      };
      if (!relationship) {
        attrs.noEvidence.x = 8;
      }

    }
    this.addPort({
      group: LIST_GROUP_NAME,
      attrs
    })
  }

  setColor(colorKey: string, low?: number, high?: number): this {
    const self = this;
    const deep = getColor(colorKey, low ? low : 200);
    const light = getColor(colorKey, high ? high : 100);

    self.attr('body/fill', light);

    /*   this.getPorts().forEach(el => {
        this.portProp(el.id, 'attrs/body/fill', light)
      }) */

    return this;
  }


  setBorder(colorKey: string, hue?: number): this {
    const self = this;
    const deep = getColor(colorKey, hue ? hue : 500);

    self.attr('.highlighter/stroke', deep);

    return this;
  }

  unsetBorder(): this {
    const self = this;

    self.attr('.highlighter/stroke', 'transparent');

    return this;
  }

  addIcon(icon: string) {
    this.attr('icon/xlinkHref', icon);
  }


  hover(on: boolean): this {
    const self = this;
    self.attr('.wrapper/strokeWidth', on ? 40 : 0);
    self.attr('.edit/visibility', on ? 'visible' : 'hidden');
    self.attr('.delete/visibility', on ? 'visible' : 'hidden');

    return this;
  }
}

export class NodeCellMolecule extends shapes.NodeCellMolecule {
  constructor() {
    super();

  }

  addNodePorts(): this {
    const self = this;

    return this;
  }

  setColor(colorKey: string, low?: number, high?: number): this {
    const self = this;
    const deep = getColor(colorKey, low ? low : 200);
    const light = getColor(colorKey, high ? high : 100);

    self.attr('.circle/stroke', deep);
    self.attr('.circle/fill', light);

    //this.attr('.icon/height', 200);

    return this;
  }


  setText(text: string): this {
    const self = this;

    self.attr('.label/text', text);

    return this;
  }


  setBorder(colorKey: string, hue?: number): this {
    const self = this;
    const deep = getColor(colorKey, hue ? hue : 500);

    self.attr('.highlighter/stroke', deep);

    return this;
  }

  unsetBorder(): this {
    const self = this;

    self.attr('.highlighter/stroke', 'transparent');

    return this;
  }


  hover(on: boolean): this {
    const self = this;
    self.attr('.wrapper/strokeWidth', on ? 40 : 0);
    self.attr('.edit/visibility', on ? 'visible' : 'hidden');
    self.attr('.delete/visibility', on ? 'visible' : 'hidden');

    return this;
  }
}

export class NodeLink extends shapes.NodeLink {
  colorKey = 'grey'

  static create() {
    const link = new NodeLink();
    link.prop({
      z: -1,
      labels: [{
        markup: [{
          tagName: 'rect',
          selector: 'labelBody'
        }, {
          tagName: 'text',
          selector: 'labelText'
        }],
        attrs: {
          labelText: {
            fill: '#7c68fc',
            fontSize: 8,
            fontFamily: 'sans-serif',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle'
          },
          labelBody: {
            ref: 'labelText',
            refX: -5,
            refY: -5,
            refWidth: '100%',
            refHeight: '100%',
            refWidth2: 10,
            refHeight2: 10,
            stroke: '#7c68fc',
            fill: 'white',
            strokeWidth: 1,
            rx: 5,
            ry: 5
          }
        },
        position: {
          distance: 0.5,
          args: {
            //keepGradient: true,
            ensureLegibility: true,
            absoluteOffset: true
          }
        }
      }],
    });
    link.router('normal', {
      // step: 10,
      // padding: 0,
      //  startDirections: ['bottom'],
      //   endDirections: ['top'],
    }).connector('smooth');

    return link;
  }

  setText(text: string): this {
    const self = this;

    self.label(0, {
      attrs: {
        labelText: {
          text: text
        }
      }
    });

    return this;
  }

  setColor(colorKey: string, defaultColor = false): this {
    const self = this;

    if (defaultColor) {
      this.colorKey = colorKey;
    }
    const deep = getColor(colorKey, 800);
    const light = getColor(colorKey, 600);

    const lineColor = light ? light : colorKey;
    const textColor = deep ? deep : colorKey;

    self.attr('line/stroke', lineColor);
    self.attr('line/targetMarker/stroke', lineColor);
    self.attr('line/targetMarker/fill', lineColor);
    self.label(0, {
      attrs: {
        labelText: {
          fill: textColor
        },
        labelBody: {
          stroke: lineColor
        }
      }
    });

    return this;
  }

  hover(on: boolean): this {
    const self = this;

    self.attr('line/strokeWidth', on ? 4 : 1);
    self.label(0, {
      attrs: {
        labelBody: {
          strokeWidth: on ? 2 : 1
        }
      }
    });

    return this;
  }
}

export class NodeCellList2 extends shapes.NodeCellList {

  constructor() {
    super();

  }

  addNodePorts(): this {
    const self = this;

    return this;
  }

  setColor(colorKey: string, low?: number, high?: number): this {
    const self = this;
    const deep = getColor(colorKey, low ? low : 200);
    const light = getColor(colorKey, high ? high : 100);

    self.attr('.activity-gp-rect/fill', deep);
    self.attr('.activity-mf-rect/fill', light);
    self.attr('.activity-cc-rect/fill', light);
    self.attr('.activity-bp-rect/fill', light);

    //this.attr('.icon/height', 200);

    return this;
  }


  setBorder(colorKey: string, hue?: number): this {
    const self = this;
    const deep = getColor(colorKey, hue ? hue : 500);

    self.attr('.highlighter/stroke', deep);

    return this;
  }

  unsetBorder(): this {
    const self = this;

    self.attr('.highlighter/stroke', 'transparent');

    return this;
  }


  hover(on: boolean): this {
    const self = this;
    self.attr('.wrapper/strokeWidth', on ? 40 : 0);
    self.attr('.edit/visibility', on ? 'visible' : 'hidden');
    self.attr('.delete/visibility', on ? 'visible' : 'hidden');

    return this;
  }
}
@Injectable({
  providedIn: 'root'
})
export class NoctuaShapesService {
  constructor() {
    this._initialize();
  }

  private _initialize() {

    const self = this;

    (Object as any).assign(joint.shapes, {
      noctua: {
        StencilNode: StencilNode,
        NodeCell: NodeCell,
        NodeCellMolecule: NodeCellMolecule,
        NodeCellList: NodeCellList,
        NodeLink: NodeLink
      }
    });

    const NodeCellBase = joint.dia.Element.define('noctua.NodeCellBase', {
      z: 3,
      attrs: {
        root: {
          pointerEvents: 'bounding-box',
          magnet: false
        },
        body: {
          strokeWidth: 2,
          fillOpacity: 0.2
        },
        label: {
          textWrap: {
            height: -20,
            width: -20,
            ellipsis: true
          },
          refX: '50%',
          refY: '50%',
          fontSize: 16,
          fontFamily: 'sans-serif',
          fill: '#333333',
          textAnchor: 'middle',
          textVerticalAnchor: 'middle'
        }
      }
    }, {
      // Prototype
    }, {

    });

  }
}
