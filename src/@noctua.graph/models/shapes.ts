import * as joint from 'jointjs';

declare module 'jointjs' {
  namespace shapes {
    namespace noctua {
      class StencilNode extends joint.dia.Link { }
      class NodeCell extends joint.dia.Element { }
      // class NodeCellList extends joint.dia.Element { }
      class NodeLink extends joint.dia.Link { }
    }
  }
}

export const enum NodeCellType {
  link = 'noctua.NodeLink',
  cell = 'noctua.NodeCellList',
}

export const StencilNode = joint.dia.Element.define('noctua.StencilNode', {
  size: { width: 80, height: 80 },
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      fill: '#FFFFFF',
      stroke: '#AAAAAA'
    },
    iconBackground: {
      ref: 'icon',
      refWidth: '100%',
      refHeight: '100%',
      fill: 'transparent'
    },
    icon: {
      x: 0,
      y: 10,
      refWidth: '100%',
      height: 50,
    },
    label: {
      y: 70,
      height: '30px',
      refX: '50%',
      // refY: '50%',
      // refY2: 10,
      fill: '#000',
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      //fontWeight: 'bold',
      fontFamily: 'sans-serif',
      fontSize: 8,
      textWrap: {
        ellipsis: false,
        width: '95%'
      }
    }
  }
}, {
  markup: [{
    tagName: 'rect',
    selector: 'body'
  }, {
    tagName: 'rect',
    selector: 'statusLine'
  }, {
    tagName: 'rect',
    selector: 'iconBackground'
  }, {
    tagName: 'image',
    selector: 'icon'
  }, {
    tagName: 'text',
    selector: 'label'
  }]
}, {

});

export const NodeCell = joint.dia.Element.define('noctua.NodeCell', {
  attrs: {
    root: {
      magnet: true,
    },
    wrapper: {
      magnet: true,
      refWidth: '100%',
      refHeight: '100%',
      // fill: '#FF0000',
      stroke: 'rgba(0,0,255,0.3)',
    },
    body: {
      refWidth: '100%',
      refHeight: '100%',
      fill: '#FFFFFF',
      stroke: 'rgba(0,0,255,0.3)',
    },

    noctuaTitle: {
      x: 0,
      refX: '10px',
      refY: '10px',
      fill: '#000000',
      textAnchor: 'left',
      textVerticalAnchor: 'top',
      // fontFamily: 'sans-serif',
      fontSize: 12,
      text: '',
      textWrap: {
        //width: -50,
        //height: -40,
        ellipsis: true
      }
    }
  },
  /*
  inPorts: ['top', 'bottom', 'left',],
  outPorts: ['right'],


   ports: {
    groups: {
      left: {
        position: 'left',
        attrs: portAttrs,
        markup: '<circle class="port-body"/><text/>'
      },
      bottom: {
        position: 'bottom',
        attrs: portAttrs,
        markup: '<circle class="port-body"/><text/>'
      },
      top: {
        position: 'top',
        attrs: portAttrs,
        markup: '<circle class="port-body"/><text/>'
      },
      right: {
        position: 'right',
        attrs: {
          '.port-body': {
            fill: '#E74C3C',
            r: 10,
            magnet: 'passive'
          }
        },
        markup: '<circle class="port-body"/>'
      }
    },
    items: [{
      id: 'top',
      group: 'top'
    }, {
      id: 'right',
      group: 'right'
    }, {
      id: 'bottom',
      group: 'bottom'
    }, {
      id: 'left',
      group: 'left'
    }],
  }, */
}, {
  markup: [{
    tagName: 'rect',
    selector: 'wrapper'
  }, {
    tagName: 'rect',
    selector: 'body'
  }, {
    tagName: 'text',
    selector: 'noctuaTitle'
  }],

}, {
  create: function (text) {
    return new this({
      attrs: {
        label: { text: text }
      }
    });
  }
});

export const NodeCellList = joint.dia.Element.define('noctua.NodeCellList', {
  attrs: {
    root: {
      magnet: true,
    },
    '.wrapper': {
      magnet: true,
      refWidth: '100%',
      refHeight: '100%',
      fill: 'transparent',
      stroke: 'rgba(0,0,255,0.3)',
    },
    '.highlighter': {
      refWidth: '100%',
      refHeight: '100%',
      fill: 'none',
      stroke: 'transparent',
      'stroke-width': 10,
    },
    'rect': { width: 300, },

    '.activity-gp-rect': {
      fill: '#d5d2d5',
      stroke: '#fff',
      height: 50,
      'stroke-width': 0.5
    },
    '.edit': {
      event: 'element:.edit:pointerdown',
      'xlink:href': './assets/icons/edit.svg',
      ref: '.wrapper',
      refX: '100%',
      refX2: 5,
      y: 0,
      height: 20,
      cursor: 'pointer',
      visibility: 'hidden'
    },
    '.delete': {
      event: 'element:.delete:pointerdown',
      'xlink:href': './assets/icons/delete.svg',
      ref: '.wrapper',
      refX: '100%',
      refX2: 5,
      y: 30,
      height: 20,
      cursor: 'pointer',
      visibility: 'hidden',
    },
    '.activity-mf-rect': {
      fill: '#d5fdd5',
      stroke: '#fff',
      'stroke-width': 0.5
    },
    '.activity-cc-rect': {
      fill: '#d5fdd5',
      stroke: '#fff',
      'stroke-width': 0.5
    },
    '.activity-bp-rect': {
      fill: '#d5fdd5',
      stroke: '#fff',
      'stroke-width': 0.5
    },
    '.activity-gp-text': {
      'ref': '.activity-gp-rect',
      'ref-y': .5,
      'ref-x': 5,
      'text-anchor': 'left',
      'y-alignment': 'middle',
      'font-weight': 'bold',
      'fill': 'black',
      'font-size': 12,
      'font-family': 'Times New Roman',
      textWrap: {
        width: '90%',
        ellipsis: false,
      },
    },
    '.activity-mf-text': {
      'ref': '.activity-mf-rect',
      'ref-y': 5, 'ref-x': 5,
      'fill': 'black',
      'font-size': 12,
      'font-family': 'Times New Roman',
      textWrap: {
        width: '90%',
        ellipsis: false,
      },
    },
    '.activity-cc-text': {
      'ref': '.activity-cc-rect',
      'ref-y': 5, 'ref-x': 5,
      'fill': 'black',
      'font-size': 12,
      'font-family': 'Times New Roman',
      textWrap: {
        ellipsis: false,
      },
    },
    '.activity-bp-text': {
      'ref': '.activity-bp-rect',
      'ref-y': 5, 'ref-x': 5,
      'fill': 'black',
      'font-size': 12,
      'font-family': 'Times New Roman',
      textWrap: {
        width: '90%',
        ellipsis: false,
      },
    }
  },

  name: [],
  attributes: [],
  gp: []
}, {
  markup: [
    '<rect class="wrapper"/>',
    '<rect class="highlighter"/>',
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect class="activity-mf-rect"/>',
    '<rect class="activity-gp-rect"/>',
    '<rect class="activity-cc-rect"/>',
    '<rect class="activity-bp-rect"/>',
    '</g>',
    '<text class="activity-mf-text"/>',
    '<text class="activity-gp-text"/>',
    '<text class="activity-cc-text"/>',
    '<text class="activity-bp-text"/>',
    '<image class="delete"/>',
    '<image class="edit"/>',
    '</g>'
  ].join(''),

  initialize: function () {

    this.on('change:name change:attributes change:gp', function () {
      this.updateRectangles();

      //this.set('size', { height: 500, width: 120 });

      this.trigger('activity-update');
    }, this);

    this.updateRectangles();

    joint.dia.Element.prototype.initialize.apply(this, arguments);
  },

  getClassName: function () {
    return this.get('name');
  },

  updateRectangles: function () {

    const attrs = this.get('attrs');

    const rects = [
      { type: 'gp', text: this.get('gp') },
      { type: 'mf', text: this.get('mf') },
    ];

    const cc = this.get('cc');
    const bp = this.get('bp');

    if (cc) {
      rects.push({ type: 'cc', text: cc })
    }

    if (bp) {
      rects.push({ type: 'bp', text: bp })
    }

    let offsetY = 0;

    rects.forEach(function (rect) {

      const lines = Array.isArray(rect.text) ? rect.text : [rect.text];
      const rectHeight = lines.length * 30 + 200;

      attrs['.activity-' + rect.type + '-text'].text = lines.join('\n');
      attrs['.activity-' + rect.type + '-rect'].height = rectHeight;
      attrs['.activity-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

      offsetY += rectHeight;
    });
  }

});


export const NodeCellMolecule = joint.dia.Element.define('noctua.NodeCellMolecule', {
  attrs: {
    '.wrapper': {
      refCx: '50%',
      refCy: '50%',
      refR: '50%',
      magnet: true,
      refWidth: '100%',
      refHeight: '100%',
      fill: 'transparent',
      stroke: 'rgba(0,0,255,0.3)',
    },
    '.circle': {
      // refPoints: '0,10 10,15 30,15 40,10 30,5 10,5',
      refCx: '50%',
      refCy: '50%',
      refR: '50%',
      strokeWidth: 2,
    },
    '.label': {
      textVerticalAnchor: 'middle',
      textAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 12,
      fill: '#333333',
      textWrap: {
        ellipsis: false,
        width: '95%'
      }
    },
    '.edit': {
      event: 'element:.edit:pointerdown',
      'xlink:href': './assets/icons/edit.svg',
      ref: '.wrapper',
      refX: '100%',
      refX2: -10,
      y: 0,
      height: 20,
      cursor: 'pointer',
      visibility: 'hidden'
    },
    '.delete': {
      event: 'element:.delete:pointerdown',
      'xlink:href': './assets/icons/delete.svg',
      ref: '.wrapper',
      refX: '100%',
      refX2: 5,
      y: 30,
      height: 20,
      cursor: 'pointer',
      visibility: 'hidden',
    },
  }
}, {
  markup: [
    '<circle class="wrapper"/>',
    '<g class="rotatable">',
    '<g class="scalable">',
    '<circle class="circle"/>',
    '</g>',
    '<text class="label"/>',
    '<image class="delete"/>',
    '<image class="edit"/>',
    '</g>'
  ].join(''),
}, {
  create: function (text) {
    return new this({
      attrs: {
        label: { text: text }
      }
    });
  }
});

export const NodeLink = joint.shapes.devs.Link.define('noctua.NodeLink', {
  attrs: {
    line: {
      connection: true,
      stroke: '#005580',
      strokeWidth: 1,
      strokeLinejoin: 'round',
      /*  sourceMarker: {
         type: 'rect',
         width: 10,
         height: 20,
         y: -10,
         stroke: 'none'
       }, */
      targetMarker: {
        type: 'path',
        stroke: 'black',
        fill: 'black',
        d: 'M 10 -5 0 0 10 5 Z'
      }
    },
    defaultLabel: {
      markup: [
        {
          tagName: 'rect',
          selector: 'body'
        }, {
          tagName: 'text',
          selector: 'label'
        }
      ],
      attrs: {
        label: {
          text: {
            text: '150'
          },
          fill: 'blue',
          fontSize: 10,
          textAnchor: 'middle',
          yAlignment: 'middle',
          pointerEvents: 'none'
        },
        body: {
          ref: 'label',
          fill: 'pink',
          stroke: '#005580',
          strokeWidth: 1,
          refWidth: '120%',
          refHeight: '120%',
          refX: '-10%',
          refY: '-10%'
        }
      },
    }
  }
}, {
  markup: [{
    tagName: 'path',
    selector: 'line',
    attributes: {
      'fill': 'none',
      'pointer-events': 'none'
    }
  }]
}, {

});




export const ClassView = joint.dia.ElementView.extend({

  initialize: function () {

    joint.dia.ElementView.prototype.initialize.apply(this, arguments);

    this.listenTo(this.model, 'activity-update', function () {
      this.update();
      this.resize();
    });
  }
});
