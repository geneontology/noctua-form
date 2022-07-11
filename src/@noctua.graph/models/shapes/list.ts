import { dia, g } from 'jointjs';

declare module 'jointjs' {
  namespace shapes {
    namespace noctua {
      class NodeCellList extends dia.Element { }
    }
  }
}


const GRID_SIZE = 8;
const PADDING_S = GRID_SIZE;
const PADDING_L = GRID_SIZE * 2;
const FONT_FAMILY = 'sans-serif';
const DARK_COLOR = 'transparent';

const HEADER_ICON_SIZE = 30;
const HEADER_HEIGHT = 40;

export const LIST_GROUP_NAME = 'list';
const LIST_ITEM_HEIGHT = 35;
export const LIST_ITEM_WIDTH = 200;
const LIST_ITEM_GAP = 0;
const LIST_ADD_BUTTON_SIZE = 20;

const itemPosition = (portsArgs: dia.Element.Port[], elBBox: dia.BBox): g.Point[] => {
  return portsArgs.map((_port: dia.Element.Port, index: number, { length }) => {
    const bottom = elBBox.height - (LIST_ITEM_HEIGHT + LIST_ADD_BUTTON_SIZE) / 2 - PADDING_S;
    const y = (length - 1 - index) * (LIST_ITEM_HEIGHT + LIST_ITEM_GAP);
    return new g.Point(0, bottom - y);
  });
};

const itemAttributes = {
  attrs: {
    body: {
      width: 'calc(w)',
      height: 'calc(h)',
      x: '0',
      y: 'calc(-0.5*h)',
      fill: DARK_COLOR,
      stroke: 'white',
      strokeWidth: 1,
    },
    relationship: {
      width: 60,
      pointerEvents: 'none',
      fontFamily: FONT_FAMILY,
      fontWeight: 400,
      fontSize: 9,
      fill: 'black',
      textAnchor: 'start',
      textVerticalAnchor: 'middle',
      textWrap: {
        width: 60,
        maxLineCount: 2,
        ellipsis: true
      },
      x: 8
    },
    portLabel: {
      width: 100,
      pointerEvents: 'none',
      fontFamily: FONT_FAMILY,
      fontSize: 12,
      fill: 'black',
      textAnchor: 'start',
      textVerticalAnchor: 'middle',
      textWrap: {
        width: 140,
        maxLineCount: 2,
        ellipsis: true
      },
      x: 60
    },

    noEvidence: {
      'xlink:href': './assets/icons/no-evidence.png',
      ref: 'body',
      x: 60,
      y: -8,
      height: 15,
      cursor: 'pointer',
      visibility: 'hidden'
    },

  },
  size: {
    width: LIST_ITEM_WIDTH,
    height: LIST_ITEM_HEIGHT
  },
  markup: [{
    tagName: 'rect',
    selector: 'body'
  }, {
    tagName: 'text',
    selector: 'relationship'
  }, {
    tagName: 'text',
    selector: 'portLabel',
  }, {
    tagName: 'image',
    selector: 'noEvidence',
  }]
};

const headerAttributes = {
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
    body: {
      width: 'calc(w)',
      height: 'calc(h)',
    },
    icon: {
      width: HEADER_ICON_SIZE,
      height: HEADER_ICON_SIZE,
      x: 5,
      y: (HEADER_HEIGHT - HEADER_ICON_SIZE) / 2,
    },
    label: {
      x: 40,
      y: 15,
      fontFamily: FONT_FAMILY,
      fontWeight: 600,
      fontSize: 12,
      fill: "black",
      text: 'Label',
      textWrap: {
        width: '90%',
        maxLineCount: 1,
        ellipsis: true
      },
      textVerticalAnchor: 'top',
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

  },
  markup: [{
    tagName: 'rect',
    selector: '.wrapper',
  }, {
    tagName: 'rect',
    selector: '.highlighter',
  }, {
    tagName: 'rect',
    selector: 'body',
  }, {
    tagName: 'text',
    selector: 'label',
  }, {
    tagName: 'image',
    selector: 'icon',
  }, {
    tagName: 'image',
    selector: '.edit',
  }, {
    tagName: 'image',
    selector: '.delete',
  }]
};

export class NodeCellList extends dia.Element {

  override defaults() {
    return {
      ...super.defaults,
      ...headerAttributes,
      type: 'ListElement',
      size: { width: LIST_ITEM_WIDTH, height: 0 },
      ports: {
        groups: {
          [LIST_GROUP_NAME]: {
            position: itemPosition,
            ...itemAttributes
          }
        },
        items: []
      }
    }
  }

  override initialize(...args: any[]) {
    this.on('change:ports', () => this.resizeToFitPorts());
    this.resizeToFitPorts();
    super.initialize.call(this, ...args);
  }


  resizeToFitPorts() {
    const { length } = this.getPorts();
    this.prop(['size', 'height'], HEADER_HEIGHT + (LIST_ITEM_HEIGHT + LIST_ITEM_GAP) * length + PADDING_L);
  }

}

