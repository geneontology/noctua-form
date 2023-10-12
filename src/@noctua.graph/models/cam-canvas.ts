import {
    Activity,
    ActivityNode,
    ActivityNodeType,
    ActivityTreeNode,
    ActivityType,
    Cam,
    Entity,
    noctuaFormConfig,
    NoctuaFormUtils,
    Predicate,
    Triple
} from '@geneontology/noctua-form-base';
import { NodeCellType } from './shapes';
import { NodeCellList, NodeCellMolecule, NodeLink, StencilNode } from './../services/shapes.service';
import * as joint from 'jointjs';
import { each, cloneDeep, find } from 'lodash';
import { StencilItemNode } from './../data/cam-stencil';
import { getEdgeColor } from './../data/edge-display';

export class CamCanvas {

    canvasPaper: joint.dia.Paper;
    canvasGraph: joint.dia.Graph;
    selectedStencilElement;
    elementOnClick: (element: joint.shapes.noctua.NodeCellList) => void;
    editOnClick: (element: joint.shapes.noctua.NodeCellList) => void;
    deleteOnClick: (element: joint.shapes.noctua.NodeCellList) => void;
    linkOnClick: (element: joint.shapes.noctua.NodeLink) => void;
    onUpdateCamLocations: (cam: Cam) => void
    onLinkCreated: (
        sourceId: string,
        targetId: string,
        link: joint.shapes.noctua.NodeLink) => void;
    cam: Cam;

    constructor() {
        this._initializeCanvas()
    }

    private _initializeCanvas() {
        const self = this;
        self.canvasGraph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
        self.canvasPaper = new joint.dia.Paper({
            cellViewNamespace: joint.shapes,
            el: document.getElementById('noc-paper'),
            height: '100%',
            width: '100%',
            model: this.canvasGraph,
            restrictTranslate: true,
            multiLinks: false,
            markAvailable: true,
            // defaultConnectionPoint: { name: 'boundary', args: { extrapolate: true } },
            // defaultConnector: { name: 'rounded' },
            // defaultRouter: { name: 'orthogonal' },
            /*     defaultLink: new joint.dia.Link({
                  attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
                }), */
            validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                // Prevent linking from input ports.
                // if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
                // Prevent linking from output ports to input ports within one element.
                if (cellViewS === cellViewT) return false;
                // Prevent linking to input ports.
                /// return magnetT && magnetT.getAttribute('port-group') === 'in';

                return true; // (magnetS !== magnetT);
            },
            validateMagnet: function (cellView, magnet) {
                // Note that this is the default behaviour. Just showing it here for reference.
                // Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
                // return magnet.getAttribute('magnet') !== 'passive';
                return true;
            },

            // connectionStrategy: joint.connectionStrategies.pinAbsolute,
            defaultConnectionPoint: { name: 'boundary', args: { sticky: true } },

            defaultConnector: { name: 'smooth' },
            async: true,
            interactive: { labelMove: false },
            linkPinning: false,
            // frozen: true,
            gridSize: 10,
            drawGrid: {
                name: 'doubleMesh',
                args: [
                    { color: '#DDDDDD', thickness: 1 }, // settings for the primary mesh
                    { color: '#DDDDDD', scaleFactor: 5, thickness: 4 } //settings for the secondary mesh
                ]
            },
            sorting: joint.dia.Paper.sorting.APPROX,
            // markAvailable: true,
            defaultLink: function () {
                return NodeLink.create();
            },
            perpendicularLinks: false,

        });

        self.canvasPaper.on('blank:pointerdblclick', function () {
            // Remove all Highlighters from all cells
            self.unselectAll();
        });

        this.canvasPaper.on('element:pointerup', function (cellView) {
            if (self.cam.layoutChanged) {
                self.cam.layoutChanged = false;
                self.updateLocation();
            }
        });

        this.canvasPaper.on('element:pointerdblclick', function (cellView) {
            const element = cellView.model;
            self.elementOnClick(element);

            if (element.get('type') !== NodeCellType.link) {
                const cell = element as NodeCellList
                self.selectNode(cell)
            }
        });

        this.canvasPaper.on('element:mouseover', function (cellView) {
            const element = cellView.model;
            if (element.get('type') !== NodeCellType.link) {
                const cell = element as NodeCellList
                cell.hover(true);
                self.highlightSuccessorNodes(cell)
            }
        });

        this.canvasPaper.on('element:mouseleave', function (cellView) {
            cellView.removeTools();
            const element = cellView.model;
            if (element.get('type') !== NodeCellType.link) {
                (element as NodeCellList).hover(false);
                self.unhighlightAllNodes()
            }
        });

        this.canvasPaper.on('link:mouseenter', function (cellView) {
            cellView.removeTools();
            const element = cellView.model;
            if (element.get('type') === NodeCellType.link) {
                (element as NodeLink).hover(true);
            }

        });

        this.canvasPaper.on('link:mouseleave', function (cellView) {
            cellView.removeTools();
            const element = cellView.model;
            if (element.get('type') === NodeCellType.link) {
                (element as NodeLink).hover(false);
            }

        });
        /* 'element:pointerup': function (elementView, evt, x, y) {
            const coordinates = new joint.g.Point(x, y);
            const elementAbove = elementView.model;
            const elementBelow = this.model.findModelsFromPoint(coordinates).find(function (el) {
                return (el.id !== elementAbove.id);
            });

            // If the two elements are connected already, don't
            if (elementBelow && self.canvasGraph.getNeighbors(elementBelow).indexOf(elementAbove) === -1) {

                // Move the element to the position before dragging.
                elementAbove.position(evt.data.x, evt.data.y);
                self.createLinkFromElements(elementAbove, elementBelow)

            }
        },
        'element:gate:click': function (elementView) {
            const element = elementView.model;
            const gateType = element.gate();
            const gateTypes = Object.keys(element.gateTypes);
            const index = gateTypes.indexOf(gateType);
            const newIndex = (index + 1) % gateTypes.length;
            element.gate(gateTypes[newIndex]);
        } */


        this.canvasPaper.on('link:pointerdblclick', function (linkView) {
            const link = linkView.model;

            self.linkOnClick(link);
            self.unselectAll();
        });

        this.canvasPaper.on('element:.edit:pointerdown', function (elementView: joint.dia.ElementView, evt) {
            evt.stopPropagation();

            const element = elementView.model;
            self.editOnClick(element);

        });

        this.canvasPaper.on('element:.delete:pointerdown', function (elementView: joint.dia.ElementView, evt) {
            evt.stopPropagation();

            const element = elementView.model;
            self.deleteOnClick(element);

        });

        this.canvasPaper.on('element:expand:pointerdown', function (elementView: joint.dia.ElementView, evt) {
            evt.stopPropagation();

            const model = elementView.model;
            const activity = model.prop('activity') as Activity;
            self.toggleActivityVisibility(model, activity);
        });


        this.canvasGraph.on('change:position', function (element: joint.dia.Element, evt) {
            self.cam.layoutChanged = true;
        });

        this.canvasGraph.on('change:source change:target', function (link) {
            const sourcePort = link.get('source').port;
            const sourceId = link.get('source').id;
            const targetPort = link.get('target').port;
            const targetId = link.get('target').id;

            if (targetId && sourceId) {

                self.onLinkCreated(sourceId, targetId, link)
            }
        });
    }

    addLink(link: NodeLink, predicate: Predicate) {
        const self = this;

        link.set({
            activity: predicate,
            id: predicate.uuid
        });

        link.setText(predicate.edge.label);


        // link.findView(this).addTools(tools);

    }

    highlightSuccessorNodes(node: NodeCellList) {
        const self = this;

        self.unhighlightAllNodes()

        const predecessors = self.canvasGraph.getPredecessors(node)
        const successors = self.canvasGraph.getSuccessors(node)


        each(self.canvasGraph.getCells(), (cell: NodeCellList) => {
            if (cell.get('type') !== NodeCellType.link) {
                cell.setColor('grey', 200, 300);
            }
        })
        each(successors, (cell: NodeCellList) => {
            if (cell.get('type') !== NodeCellType.link) {
                cell.setColor('amber', 200, 300)
            }
        })

        each(predecessors, (cell: NodeCellList) => {
            if (cell.get('type') !== NodeCellType.link) {
                cell.setColor('yellow', 50, 100)
            }
        })
        node.setColor('yellow', 100, 200)
    }

    selectNode(node: NodeCellList) {
        const self = this;

        self.unselectAll()

        node.setBorder('orange', 500,)

    }

    updateLocation() {
        const self = this;

        each(self.canvasGraph.getElements(), (element: NodeCellList) => {
            if (element.get('type') !== NodeCellType.link) {
                const activity = element.prop('activity') as Activity
                if (activity) {
                    const position = element.position();

                    activity.position.x = position.x;
                    activity.position.y = position.y;
                }
            }
        })

        self.onUpdateCamLocations(self.cam)
    }

    unhighlightAllNodes() {
        const self = this;
        each(self.canvasGraph.getCells(), (cell: NodeCellList) => {
            if (cell.get('type') !== NodeCellType.link) {
                const activity = cell.prop('activity') as Activity
                cell.setColor(activity.backgroundColor);
            }
        })
    }

    unselectAll() {
        const self = this;
        each(self.canvasGraph.getCells(), (cell: NodeCellList) => {
            if (cell.get('type') !== NodeCellType.link) {
                cell.unsetBorder();
            }
        })
    }

    createLinkFromElements(source: joint.shapes.noctua.NodeCellList, target: joint.shapes.noctua.NodeCellList) {
        const self = this;

        const subject = source.get('activity') as Activity;
        const object = target.get('activity') as Activity;

        self.createLink(subject, new Predicate(Entity.createEntity(noctuaFormConfig.edge.causallyUpstreamOf)), object)
    }

    createLink(subject: Activity, predicate: Predicate, object: Activity) {
        const self = this;
        const triple = new Triple(subject, object, predicate);

        ///self.cam.addNode(predicate);
        //self.cam.addTriple(triple);
        self.createLinkFromTriple(triple, true);
    }

    createLinkFromTriple(triple: Triple<Activity>, autoLayout?: boolean) {
        const self = this;

        const link = NodeLink.create();
        link.setText(triple.predicate.edge.label);
        link.set({
            activity: triple.predicate,
            id: triple.predicate.edge.id,
            source: {
                id: triple.subject.id,
                port: 'right'
            },
            target: {
                id: triple.object.id,
                port: 'left'
            }
        });

        link.addTo(self.canvasGraph);
        if (autoLayout) {
            self.autoLayoutGraph(self.canvasGraph);
            // self.addCanvasGraph(self.activity);
        }
    }

    paperScale(delta: number, e) {
        const el = this.canvasPaper.$el;
        const newScale = this.canvasPaper.scale().sx + delta;

        if (newScale > 0.1 && delta < 10) {
            const offsetX = (e.offsetX || e.clientX - el.offset().left);
            const offsetY = (e.offsetY || e.clientY - el.offset().top);
            const localPoint = this._offsetToLocalPoint(offsetX, offsetY);

            this.canvasPaper.translate(0, 0);
            this.canvasPaper.scale(newScale, newScale, localPoint.x, localPoint.y);
        }
    };

    zoom(delta: number, e?) {
        if (e) {
            this.paperScale(delta, e);
        } else {
            this.canvasPaper.translate(0, 0);
            this.canvasPaper.scale(this.canvasPaper.scale().sx + delta, this.canvasPaper.scale().sx + delta)
        }
    }

    resetZoom() {
        this.canvasPaper.scale(1, 1)
    };

    toggleActivityVisibility(cell: joint.dia.Element, activity: Activity) {
        const self = this;

        //self.activity.subgraphVisibility(activity, !activity.expanded);
        const elements = self.canvasGraph.getSuccessors(cell).concat(cell);
        // find all the links between successors and the element
        const subgraph = self.canvasGraph.getSubgraph(elements);

        if (activity.expanded) {
            subgraph.forEach((element) => {
                element.attr('./visibility', 'hidden');
            });
        } else {
            subgraph.forEach((element) => {
                element.attr('./visibility', 'visible');
            });
        }

        cell.attr('./visibility', 'visible');
        activity.expanded = !activity.expanded;

        self.autoLayoutGraph(self.canvasGraph);

        self.canvasPaper.translate(0, 0);

        //  self.canvasPaper.
    }

    private _addGPEntity(treeNode: ActivityTreeNode, el: NodeCellList) {
        const self = this;

        if (treeNode.node?.displaySection.id === noctuaFormConfig.displaySection.gp.id) {
            if (treeNode.node?.term && treeNode.node.predicate.edge?.id !== noctuaFormConfig.edge.enabledBy.id) {
                el.addEntity(NoctuaFormUtils.pad('—', treeNode.node.treeLevel - 2)
                    + treeNode.node.predicate.edge?.label, treeNode.node.term.label,
                    treeNode.node.predicate.hasEvidence());
            }

            treeNode.children.forEach(child => {
                self._addGPEntity(child, el)
            })
        }
    }

    private _addFDEntity(treeNode: ActivityTreeNode, el: NodeCellList) {
        const self = this;

        if (treeNode.node?.displaySection.id === noctuaFormConfig.displaySection.fd.id) {
            if (treeNode.node?.term) {
                el.addEntity(NoctuaFormUtils.pad('—', treeNode.node.treeLevel - 2)
                    + treeNode.node.predicate.edge?.label, treeNode.node.term.label, treeNode.node.predicate.hasEvidence());
            }

            treeNode.children.forEach(child => {
                self._addFDEntity(child, el)
            })
        }
    }

    createNode(activity: Activity, graphLayoutDetail: string): NodeCellList {
        const el = new NodeCellList()

        el.addIcon(`./assets/images/activity/coverage-${activity.summary.coverage}.png`)
        //.setSuccessorCount(activity.successorCount)

        if (graphLayoutDetail === noctuaFormConfig.graphLayoutDetail.options.detailed.id) {
            if (activity.activityType === ActivityType.proteinComplex) {
                const gpNodes = activity.buildGPTrees();
                gpNodes.forEach(gpNode => this._addGPEntity(gpNode, el));
            }

            const fdNodes = activity.buildTrees();
            fdNodes.forEach(fdNode => this._addFDEntity(fdNode, el));
        } else if (graphLayoutDetail === noctuaFormConfig.graphLayoutDetail.options.simple.id) {

            if (activity.mfNode) {
                const activityNodes = activity.getEdges(activity.mfNode.id)
                el.addEntity('', activity.mfNode?.term.label, activity.mfNode.predicate.hasEvidence());

                activityNodes.forEach((activityNode: Triple<ActivityNode>) => {
                    const canAdd = find(noctuaFormConfig.defaultGraphDisplayEdges, (edge: Entity) => edge.id === activityNode.predicate.edge?.id);

                    if (activityNode.object?.term.hasValue() && canAdd) {
                        el.addEntity(activityNode.object.predicate.edge.label, activityNode.object?.term.label,
                            activityNode.object.predicate.hasEvidence());
                    }
                })
            }
        }

        if (activity.gpNode) {
            el.addHeader(activity.gpNode?.term.label);
        } else {
            el.prop('GP info unavailable');
        }

        el.setColor(activity.backgroundColor);

        el.attr({
            expand: {
                event: 'element:expand:pointerdown',
                stroke: 'black',
                strokeWidth: 2
            },
        })
        el.set({
            activity: activity,
            id: activity.id,
            position: activity.position,
            //  size: activity.size,
        });

        return el
    }

    createMolecule(activity: Activity) {
        const el = new NodeCellMolecule()
        activity.size.width = 120;
        activity.size.height = 120;
        //.addActivityPorts()
        el.setColor(activity.backgroundColor)
        //.setSuccessorCount(activity.successorCount)  
        const activityType = activity.getActivityTypeDetail();
        const moleculeNode = activity.rootNode;

        el.prop({ 'name': [activityType ? activityType.label : 'Activity Unity'] });

        if (moleculeNode) {
            let label = moleculeNode.term.label

            if (activity.ccNode) {
                label += `\nlocated in: ${activity.ccNode.term.label}`;
            }
            el.setText(label);
        }

        el.attr({
            expand: {
                event: 'element:expand:pointerdown',
                stroke: 'black',
                strokeWidth: 2
            },
        })
        el.set({
            activity: activity,
            id: activity.id,
            position: activity.position,
            size: activity.size,
        });

        return el
    }

    addCanvasGraph(cam: Cam, graphLayoutDetail: string) {
        const self = this;
        const nodes = [];

        self.cam = cam;
        self.canvasGraph.resetCells(nodes);

        each(cam.activities, (activity: Activity) => {
            if (activity.visible) {
                let el
                if (activity.activityType === ActivityType.molecule) {
                    el = self.createMolecule(activity);
                } else {
                    el = self.createNode(activity, graphLayoutDetail);
                }
                nodes.push(el);
            }
        });

        each(cam.causalRelations, (triple: Triple<Activity>) => {
            if (triple.predicate.visible && triple.isTripleComplete()) {
                const color = getEdgeColor(triple.predicate.edge.id);
                const link = NodeLink.create();
                if (triple.predicate.isReverseLink) {
                    this.reverseLink(triple, link)
                } else {
                    // link.set('connector', { name: 'jumpover', args: { type: 'gap' } })
                    link.setText(triple.predicate.edge.label);
                    link.set({
                        activity: triple.predicate,
                        source: {
                            id: triple.subject.id,
                        },
                        target: {
                            id: triple.object.id,
                        }
                    });
                }

                link.setColor(color)
                nodes.push(link);
            }
        });
        self.canvasPaper.setDimensions('30000px', '30000px')
        self.canvasPaper.scaleContentToFit({ minScaleX: 0.3, minScaleY: 0.3, maxScaleX: 1, maxScaleY: 1 });
        self.canvasGraph.resetCells(nodes);

        if (!cam.manualLayout) {
            self.autoLayoutGraph(self.canvasGraph);
        }

        self.canvasPaper.unfreeze();
        self.canvasPaper.render();


        /*    each(self.canvasGraph.getCells(), (cell: any) => {
   
               self.mask.add(
                   cell.findView(self.canvasPaper),
                   { selector: 'body' },
                   'example-id',
                   {
                       layer: 'back',
                       attrs: {
                           'stroke': '#4666E5',
                           'stroke-width': 3,
                           'stroke-linejoin': 'round'
                       }
                   });
           }); */
    }

    reverseLink(triple: Triple<Activity>, link: NodeLink) {
        link.setText(triple.predicate.reverseLinkTitle);
        link.set({
            activity: triple.predicate,
            source: {
                id: triple.object.id,
            },
            target: {
                id: triple.subject.id,
            }
        });
    }

    addStencilGraph(graph: joint.dia.Graph, activities: Activity[]) {
        const self = this;
        const nodes = [];

        each(activities, (activity: Activity) => {
            const el = new StencilNode()
            // .size(120, 80)
            // .setColor(activity.backgroundColor)
            //.setIcon(activity.iconUrl);
            el.attr('label/text', activity.title);
            el.set({ activity: cloneDeep(activity) });

            nodes.push(el);
        });

        graph.resetCells(nodes);
        self._layout(graph);
    }

    private _layout(graph: joint.dia.Graph) {
        let currentY = 10;
        graph.getElements().forEach((el) => {
            //Sel.getBBox().bottomRight();
            el.position(10, currentY);
            currentY += el.size().height + 10;
        });
    }

    autoLayoutGraph(graph) {
        const autoLayoutElements = [];
        const manualLayoutElements = [];
        graph.getElements().forEach((el) => {
            if (el.attr('./visibility') !== 'hidden') {
                autoLayoutElements.push(el);
            }
        });
        // Automatic Layout
        joint.layout.DirectedGraph.layout(graph.getSubgraph(autoLayoutElements), {
            align: 'UL',
            setLabels: true,
            marginX: 50,
            marginY: 50,
            rankSep: 200,
            // nodeSep: 2000,
            //edgeSep: 2000,
            rankDir: "TB"
        });
        // Manual Layout
        manualLayoutElements.forEach(function (el) {
            const neighbor = graph.getNeighbors(el, { inbound: true })[0];
            if (!neighbor) return;
            const neighborPosition = neighbor.getBBox().bottomRight();
            el.position(neighborPosition.x + 20, neighborPosition.y - el.size().height / 2 - 20);
        });
    }

    private _offsetToLocalPoint(x, y) {
        const self = this;

        const svgPoint = joint.Vectorizer.createSVGPoint(x, y);
        // Transform point into the viewport coordinate system.
        const pointTransformed = svgPoint.matrixTransform(self.canvasPaper.viewport.getCTM().inverse());
        return pointTransformed;
    }

}