import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';



import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, filter, reduce, catchError, retry, tap } from 'rxjs/operators';

import { Cam } from './../models/annoton/cam';
import { Annoton } from './../models/annoton/annoton';
import { AnnotonNode } from './../models/annoton/annoton-node';
import { AnnotonParser } from './../models/annoton/parser/annoton-parser';
import { AnnotonError } from "./../models/annoton/parser/annoton-error";
import { Evidence } from './../models/annoton/evidence';

//Config
import { noctuaFormConfig } from './../noctua-form-config';
import { NoctuaConfigService } from '@noctua/services/config.service';
import { NoctuaFormConfigService } from './config/noctua-form-config.service';
import { NoctuaLookupService } from './lookup.service';
import { NoctuaFormGridService } from '../services/form-grid.service';

import 'rxjs/add/observable/forkJoin';
import * as _ from 'lodash';

declare const require: any;

const each = require('lodash/forEach');
const forOwn = require('lodash/forOwn');
const uuid = require('uuid/v1');
const annotationTitleKey = 'title';
const model = require('bbop-graph-noctua');
const amigo = require('amigo2');
const golr_response = require('bbop-response-golr');
const golr_manager = require('bbop-manager-golr');
const golr_conf = require("golr-conf");
const node_engine = require('bbop-rest-manager').node;
const barista_response = require('bbop-response-barista');
const minerva_requests = require('minerva-requests');
const jquery_engine = require('bbop-rest-manager').jquery;
const class_expression = require('class-expression');
const minerva_manager = require('bbop-manager-minerva');

@Injectable({
  providedIn: 'root'
})
export class NoctuaGraphService {
  title;
  golrServer = environment.globalGolrServer;
  baristaLocation = environment.globalBaristaLocation;
  minervaDefinitionName = environment.globalMinervaDefinitionName;
  baristaToken;
  linker;
  loggedIn;
  userInfo;
  modelInfo;
  localClosures;

  constructor(
    private noctuaConfigService: NoctuaConfigService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private formGridService: NoctuaFormGridService,
    private httpClient: HttpClient,
    private noctuaLookupService: NoctuaLookupService) {
    this.linker = new amigo.linker();
    this.userInfo = {
      groups: [],
      selectedGroup: {}
    }
    this.modelInfo = {
      graphEditorUrl: ""
    }
    this.localClosures = [];
  }

  getGraphInfo(cam: Cam, modelId) {
    const self = this;

    cam.engine = new jquery_engine(barista_response);
    cam.onGraphChanged = new BehaviorSubject(null);
    cam.modelId = modelId;
    // cam: new Cam(),

    cam.engine.method('POST');
    let manager = new minerva_manager(
      this.baristaLocation,
      this.minervaDefinitionName,
      this.baristaToken,
      cam.engine, 'async');

    cam.manager = manager;

    function _shields_up() { }
    function _shields_down() { }

    // Internal registrations.
    manager.register('prerun', _shields_up);
    manager.register('postrun', _shields_down, 9);
    manager.register('manager_error',
      function (resp) {
        console.log('There was a manager error (' +
          resp.message_type() + '): ' + resp.message());
      }, 10);

    // Likely the result of unhappiness on Minerva.
    manager.register('warning', function (resp /*, man */) {
      alert('Warning: ' + resp.message() + '; ' +
        'your operation was likely not performed');
    }, 10);

    // Likely the result of serious unhappiness on Minerva.
    manager.register('error', function (resp /*, man */) {
      let perm_flag = 'InsufficientPermissionsException';
      let token_flag = 'token';
      if (resp.message() && resp.message().indexOf(perm_flag) !== -1) {
        alert('Error: it seems like you do not have permission to ' +
          'perform that operation. Did you remember to login?');
      } else if (resp.message() && resp.message().indexOf(token_flag) !== -1) {
        alert('Error: it seems like you have a bad token...');
      } else {
        console.log('error:', resp, resp.message_type(), resp.message());

        if (resp.message().includes('UnknownIdentifierException')) {
          cam.error = true
        }
      }
    }, 10);

    manager.register('meta', function ( /* resp , man */) {
      console.log('## a meta callback?');
    });

    function rebuild(resp) {
      let noctua_graph = model.graph;

      cam.graph = new noctua_graph();
      cam.modelId = resp.data().id;
      cam.graph.load_data_basic(resp.data());
      cam.modelTitle = null;
      cam.modelState = null;
      // self.createGraphUrls(self.model_id);
      let annotations = cam.graph.get_annotations_by_key(annotationTitleKey);
      let stateAnnotations = cam.graph.get_annotations_by_key('state');

      if (annotations.length > 0) {
        // modelTitle = annotations[0].value();
      }

      if (stateAnnotations.length > 0) {
        // modelState = stateAnnotations[0].value();
      }

      self.graphPreParse(cam.graph).subscribe((data) => {
        cam.annotons = self.graphToAnnotons(cam.graph);
        self.annotonsToTable(cam.graph, cam.annotons)
        cam.onGraphChanged.next(cam.annotons);
      });

      //  title = graph.get_annotations_by_key('title');
    }

    manager.register('merge', function ( /* resp */) {
      manager.get_model(cam.modelId);
    });
    manager.register('rebuild', function (resp) {
      rebuild(resp);
    }, 10);

    manager.get_model(modelId);
  }



  /*
  getUserInfo() {
    const self = this;
    let url = self.barista_location + "/user_info_by_token/" + self.barista_token;
  
    return this.$http.get(url)
      .then(function (response) {
        if (response.data && response.data.groups && response.data.groups.length > 0) {
          self.userInfo.name = response.data['nickname'];
          self.userInfo.groups = response.data['groups'];
          self.userInfo.selectedGroup = self.userInfo.groups[0];
          self.manager.use_groups([self.userInfo.selectedGroup.id]);
        }
      });
  }
  */

  addModel(manager) {
    manager.add_model();
  }

  getNodeLabel(node) {
    let label = '';
    if (node) {
      each(node.types(), function (in_type) {

        let type;
        if (in_type.type() === 'complement') {
          type = in_type.complement_class_expression();
        } else {
          type = in_type;
        }

        label += type.class_label() +
          ' (' + type.class_id() + ')';
      });
    }

    return label;
  }

  getNodeId(node) {
    let result = null;
    if (node) {
      each(node.types(), function (in_type) {
        let type;
        if (in_type.type() === 'complement') {
          type = in_type.complement_class_expression();
        } else {
          type = in_type;
        }

        result = type.class_id();
      });
    }

    return result;
  }

  getNodeLocation(node) {
    let result = {
      x: 0,
      y: 0
    };

    let x_annotations = node.get_annotations_by_key('hint-layout-x');
    let y_annotations = node.get_annotations_by_key('hint-layout-y');

    if (x_annotations.length === 1) {
      result.x = parseInt(x_annotations[0].value());
    }

    if (y_annotations.length === 1) {
      result.y = parseInt(y_annotations[0].value());
    }

    return result;
  }

  getNodeIsComplement(node) {
    var result = true;
    if (node) {
      each(node.types(), function (in_type) {
        let t = in_type.type();
        result = result && (t === 'complement');
      });
    }

    return result;
  }

  subjectToTerm(graph, object) {
    const self = this;

    let node = graph.get_node(object);
    let result = {
      term: {
        id: self.getNodeId(node),
        label: self.getNodeLabel(node),
      },
      location: self.getNodeLocation(node),
      isComplement: self.getNodeIsComplement(node)
    }

    return result;
  }

  edgeToEvidence(graph, edge) {
    const self = this;
    const evidenceAnnotations = edge.get_annotations_by_key('evidence');
    let result = [];

    each(evidenceAnnotations, function (evidenceAnnotation) {
      let annotationId = evidenceAnnotation.value();
      let annotationNode = graph.get_node(annotationId);
      let evidence = new Evidence();

      evidence.individualId = annotationNode.id()
      if (annotationNode) {
        evidence.setEvidence({
          id: self.getNodeId(annotationNode),
          label: self.getNodeLabel(annotationNode)
        });

        let sources = annotationNode.get_annotations_by_key('source');
        let withs = annotationNode.get_annotations_by_key('with');
        let assignedBys = annotationNode.get_annotations_by_key('providedBy');
        if (sources.length > 0) {
          evidence.setReference(sources[0].value(), self.linker.url(sources[0].value()));
        }
        if (withs.length > 0) {
          if (withs[0].value().startsWith('gomodel')) {
            evidence.setWith(withs[0].value());
          } else {
            evidence.setWith(withs[0].value(), self.linker.url(withs[0].value()));
          }
        }
        if (assignedBys.length > 0) {
          evidence.setAssignedBy(assignedBys[0].value(), assignedBys[0].value());
        }
        result.push(evidence);
      }
    });

    return result;
  }

  graphPreParse(graph) {
    const self = this;
    var promises = [];

    each(graph.get_nodes(), function (node) {
      let termId = self.getNodeId(node);

      each(graph.get_edges_by_subject(node.id()), function (e) {
        let predicateId = e.predicate_id();
        let objectNode = graph.get_node(e.object_id())
        let objectTermId = self.getNodeId(objectNode);

        if (self.noctuaFormConfigService.closureCheck[predicateId]) {
          each(self.noctuaFormConfigService.closureCheck[predicateId].closures, function (closure) {
            if (closure.subject) {
              promises.push(self.isaClosurePreParse(termId, closure.subject.id, node));
            }

            if (objectTermId && closure.object) {
              promises.push(self.isaClosurePreParse(objectTermId, closure.object.id, node));
            }
          });
        }
      });
    });

    return Observable.forkJoin(promises);
  }

  isaClosurePreParse(a, b, node) {
    const self = this;

    return self.noctuaLookupService.isaClosure(a, b);
    /*
    .subscribe(function (data) {
      self.noctuaLookupService.addLocalClosure(a, b, data);
    });
    */
  }

  /*
  isaNodeClosure(a, b, node, annoton) {
    const self = this;
    let deferred = self.$q.defer();
  
    self.noctuaLookupService.isaClosure(a, b).then(function (data) {
      if (data) {
        node.closures.push(a);
        //annoton.parser.parseNodeOntology(node, data);
      }
      // console.log("node closure", data, node);
      deferred.resolve({
        annoton: annoton,
        node: node,
        result: data
      });
    });
  
    return deferred.promise;
  }
  */

  determineAnnotonType(gpObjectNode) {
    const self = this;

    if (self.noctuaLookupService.getLocalClosure(gpObjectNode.term.id, noctuaFormConfig.closures.gp.id)) {
      return noctuaFormConfig.annotonType.options.simple.name;
    } else if (self.noctuaLookupService.getLocalClosure(gpObjectNode.term.id, noctuaFormConfig.closures.mc.id)) {
      return noctuaFormConfig.annotonType.options.complex.name;
    }

    return null;
  }

  determineAnnotonModelType(mfNode, mfEdgesIn) {
    const self = this;
    let result = noctuaFormConfig.annotonModelType.options.default.name;

    if (mfNode.term.id === noctuaFormConfig.rootNode.mf.id) {
      each(mfEdgesIn, function (toMFEdge) {
        let predicateId = toMFEdge.predicate_id();

        if (_.find(noctuaFormConfig.causalEdges, {
          id: predicateId
        })) {
          result = noctuaFormConfig.annotonModelType.options.bpOnly.name;
        }
      });
    }

    return result;
  }

  graphToAnnotons(graph) {
    const self = this;
    let annotons: Annoton[] = [];

    each(graph.all_edges(), function (e) {
      if (e.predicate_id() === noctuaFormConfig.edge.enabledBy.id) {
        let mfId = e.subject_id();
        let gpId = e.object_id();
        let evidence = self.edgeToEvidence(graph, e);
        let mfEdgesIn = graph.get_edges_by_subject(mfId);
        let mfSubjectNode = self.subjectToTerm(graph, mfId);
        let gpObjectNode = self.subjectToTerm(graph, gpId);
        let gpVerified = false;
        let isDoomed = false
        let annotonType = '';// self.determineAnnotonType(gpObjectNode);
        let annotonModelType = self.determineAnnotonModelType(mfSubjectNode, mfEdgesIn);

        let annoton = self.noctuaFormConfigService.createAnnotonModel(
          annotonType ? annotonType : noctuaFormConfig.annotonType.options.simple.name,
          annotonModelType
        );

        let annotonNode = annoton.getNode('mf');
        annotonNode.location = mfSubjectNode.location;
        annotonNode.setTerm(mfSubjectNode.term);
        annotonNode.setEvidence(evidence);
        annotonNode.setIsComplement(mfSubjectNode.isComplement);
        annotonNode.modelId = mfId;

        annoton.parser = new AnnotonParser();

        if (annotonType) {
          //  if (!self.noctuaLookupService.getLocalClosure(mfSubjectNode.term.id, noctuaFormConfig.closures.mf.id)) {
          //     isDoomed = true;
          //    }
        } else {
          annoton.parser.setCardinalityError(annotonNode, gpObjectNode.term, noctuaFormConfig.edge.enabledBy.id);
        }

        if (isDoomed) {
          annoton.parser.setCardinalityError(annotonNode, gpObjectNode.term, noctuaFormConfig.edge.enabledBy.id);
        }

        self.connectAnnatons(graph, annoton, mfEdgesIn, annotonNode, isDoomed);

        self.graphToAnnatonDFS(graph, annoton, mfEdgesIn, annotonNode, isDoomed);

        annoton.print();
        annotons.push(annoton);


      }
    });

    // self.parseNodeClosure(annotons);

    return annotons;
  }

  graphToCCOnly(graph) {
    const self = this;
    let annotons: Annoton[] = [];

    each(graph.all_edges(), function (e) {
      if (e.predicate_id() === noctuaFormConfig.edge.partOf.id) {
        let predicateId = e.predicate_id();
        let gpId = e.subject_id();
        let ccId = e.object_id();
        let evidence = self.edgeToEvidence(graph, e);
        let gpEdgesIn = graph.get_edges_by_subject(gpId);
        let ccObjectNode = self.subjectToTerm(graph, ccId);
        let gpSubjectNode = self.subjectToTerm(graph, gpId);
        let gpVerified = false;
        let isDoomed = false
        let annotonType = '';//self.determineAnnotonType(gpSubjectNode);

        let annoton = self.noctuaFormConfigService.createAnnotonModel(
          annotonType ? annotonType : noctuaFormConfig.annotonType.options.simple.name,
          noctuaFormConfig.annotonModelType.options.ccOnly.name
        );

        let annotonNode = annoton.getNode('gp');
        annotonNode.setTerm(gpSubjectNode.term);
        annotonNode.setEvidence(evidence);
        annotonNode.setIsComplement(gpSubjectNode.isComplement);
        annotonNode.modelId = gpId;

        annoton.parser = new AnnotonParser();

        if (annotonType) {
          //   let closureRange = self.noctuaLookupService.getLocalClosureRange(ccObjectNode.term.id, self.noctuaFormConfigService.closureCheck[predicateId]);

          //   if (!closureRange) {
          //      isDoomed = true;
          //  }

          if (isDoomed) {
            annoton.parser.setCardinalityError(annotonNode, ccObjectNode.term, predicateId);
          }

          if (annoton.annotonModelType === noctuaFormConfig.annotonModelType.options.bpOnly.name) {
            let causalEdge = _.find(noctuaFormConfig.causalEdges, {
              id: predicateId
            })
          }

          self.graphToAnnatonDFS(graph, annoton, gpEdgesIn, annotonNode, isDoomed);

          if (annoton.annotonType === noctuaFormConfig.annotonType.options.complex.name) {
            //annoton.populateComplexData();
          }

          annotons.push(annoton);
        } else {
          annoton.parser.setCardinalityError(annotonNode, ccObjectNode.term, predicateId);
          //  self.graphToAnnatonDFS(graph, annoton, ccEdgesIn, annotonNode, true);
        }
      }
    });

    //  self.parseNodeClosure(annotons);

    return annotons;
  }

  graphToAnnatonDFS(graph, annoton, mfEdgesIn, annotonNode, isDoomed) {
    const self = this;
    let edge = annoton.getEdges(annotonNode.id);

    if (annoton.parser.parseCardinality(graph, annotonNode, mfEdgesIn, edge.nodes)) {
      each(mfEdgesIn, function (toMFEdge) {
        let predicateId = toMFEdge.predicate_id();
        let evidence = self.edgeToEvidence(graph, toMFEdge);
        let toMFObject = toMFEdge.object_id();

        if (annotonNode.id === "mc" && predicateId === noctuaFormConfig.edge.hasPart.id) {
          self.noctuaFormConfigService.addGPAnnotonData(annoton, toMFObject);
        }

        if (annoton.annotonModelType === noctuaFormConfig.annotonModelType.options.bpOnly.name) {
          let causalEdge = _.find(noctuaFormConfig.causalEdges, {
            id: predicateId
          })

          if (causalEdge) {
            //   self.adjustBPOnly(annoton, causalEdge);
          }
        }

        each(edge.nodes, function (node) {
          if (predicateId === node.edge.id) {
            if (predicateId === noctuaFormConfig.edge.hasPart.id && toMFObject !== node.object.id) {
              //do nothing
            } else {
              let subjectNode = self.subjectToTerm(graph, toMFObject);

              node.object.modelId = toMFObject;
              node.object.setEvidence(evidence);
              node.object.setTerm(subjectNode.term);
              node.object.location = subjectNode.location;
              node.object.setIsComplement(subjectNode.isComplement)

              //self.check
              let closureRange = 'false';// self.noctuaLookupService.getLocalClosureRange(subjectNode.term.id, self.noctuaFormConfigService.closureCheck[predicateId]);

              if (!closureRange && !_.find(noctuaFormConfig.causalEdges, {
                id: predicateId
              })) {
                isDoomed = true;
                annoton.parser.setCardinalityError(annotonNode, node.object.getTerm(), predicateId);
              }

              if (isDoomed) {
                annoton.parser.setNodeWarning(node.object)
              }

              self.graphToAnnatonDFS(graph, annoton, graph.get_edges_by_subject(toMFObject), node.object, isDoomed);
            }
          }
        });
      });

    }

    return annoton;

  }

  connectAnnatons(graph, annoton, mfEdgesIn, annotonNode, isDoomed) {
    const self = this;
    let edge = annoton.getEdges(annotonNode.id);

    each(mfEdgesIn, function (toMFEdge) {
      let predicateId = toMFEdge.predicate_id();
      let evidence = self.edgeToEvidence(graph, toMFEdge);
      let toMFObject = toMFEdge.object_id();

      let causalEdge = _.find(noctuaFormConfig.causalEdges, {
        id: predicateId
      })

      if (annotonNode.id === "mf" && causalEdge && predicateId === causalEdge['id']) {
        let destNode = self.noctuaFormConfigService.generateNode('mf', { id: toMFObject });
        annoton.addNode(destNode);
        annoton.addEdgeById('mf', 'mf' + toMFObject, causalEdge);
      }
    });
  }

  /*
  parseNodeClosure(annotons) {
    const self = this;
    let promises = [];
   
    each(annotons, function (annoton) {
      each(annoton.nodes, function (node) {
        let term = node.getTerm();
        if (term) {
          promises.push(self.isaNodeClosure(node.noctuaLookupServiceGroup, term.id, node, annoton));
   
          forOwn(annoton.edges, function (srcEdge, key) {
            each(srcEdge.nodes, function (srcNode) {
              //  let nodeExist = destAnnoton.getNode(key);
              //  if (nodeExist && srcNode.object.hasValue()) {
              //   destAnnoton.addEdgeById(key, srcNode.object.id, srcNode.edge);
              //   }
            });
          });
        }
      });
    });
   
    self.$q.all(promises).then(function (data) {
      console.log('done node clodure', data)
   
      each(data, function (entity) {
        //entity.annoton.parser.parseNodeOntology(entity.node);
      });
    });
  }
  */

  graphToAnnatonDFSError(annoton, annotonNode) {
    const self = this;
    let edge = annoton.getEdges(annotonNode.id);

    each(edge.nodes, function (node) {
      node.object.status = 2;
      self.graphToAnnatonDFSError(annoton, node.object);
    });
  }

  annotonsToTable(graph, annotons: Annoton[]) {
    const self = this;
    //  let result = [];

    each(annotons, function (annoton) {
      annoton.annotonRows = self.annotonToTableRows(graph, annoton);

      //  result = result.concat(annotonRows);
    });

    // return result;
  }

  annotonToTableRows(graph, annoton: Annoton) {
    const self = this;

    let gpNode = annoton.getGPNode();
    //annoton.gpTerm = gpNode.term.control.value.label;
    annoton.annotonPresentation = self.formGridService.getAnnotonPresentation(annoton);
  }

  ccComponentsToTable(graph, annotons) {
    const self = this;
    let result = [];

    each(annotons, function (annoton) {
      //   let annotonRows = self.ccComponentsToTableRows(graph, annoton);

      //  result = result.concat(annotonRows);
    });

    return result;
  }

  /*
   
  ccComponentsToTableRows(graph, annoton) {
    const self = this;
    let result = [];
   
    let gpNode = annoton.getGPNode();
    let ccNode = annoton.getNode('cc');
   
    let row = {
      gp: gpNode.term.control.value.label,
      cc: ccNode.term.control.value.label,
      original: JSON.parse(JSON.stringify(annoton)),
      annoton: annoton,
      annotonPresentation: self.formGrid.getAnnotonPresentation(annoton),
    }
   
    row.evidence = gpNode.evidence
   
    return row;
  }
  */

  addIndividual(reqs, node) {
    node.saveMeta = {};
    if (node.term.control.value && node.term.control.value.id) {
      if (node.modelId) {
        node.saveMeta.term = node.modelId;
      } else if (node.isComplement) {
        let ce = new class_expression();
        ce.as_complement(node.term.control.value.id);
        node.saveMeta.term = reqs.add_individual(ce);

      } else {
        node.saveMeta.term = reqs.add_individual(node.term.control.value.id);
      }

      node.modelId = node.saveMeta.term;
    }
  }

  edit(cam, srcNode, destNode) {
    const self = this;

    let reqs = new minerva_requests.request_set(this.noctuaConfigService.baristaToken, cam.modelId);

    if (srcNode.hasValue() && destNode.hasValue()) {
      self.editIndividual(reqs, cam.modelId, srcNode.modelId, srcNode.getTerm().id, destNode.getTerm().id);
    }

    each(destNode.evidence, (evidence: Evidence, key) => {
      if (evidence.hasValue()) {
        let srcEvidence: Evidence = <Evidence>_.find(srcNode.evidence, { individualId: evidence.individualId })
        if (srcEvidence) {
          self.editIndividual(reqs, cam.modelId, srcEvidence.individualId, srcEvidence.getEvidence().id, evidence.getEvidence().id);
        }
      }
    });

    cam.manager.user_token(this.noctuaConfigService.baristaToken);
    cam.manager.request_with(reqs);
  }

  editIndividual(reqs, modelId, individualId, oldClassId, classId) {
    reqs.remove_type_from_individual(
      class_expression.cls(oldClassId),
      individualId,
      modelId,
    );

    reqs.add_type_to_individual(
      class_expression.cls(classId),
      individualId,
      modelId,
    );
  }

  editIndividual2(reqs, cam, srcNode, destNode) {
    if (srcNode.hasValue() && destNode.hasValue()) {
      reqs.remove_type_from_individual(
        class_expression.cls(srcNode.getTerm().id),
        srcNode.modelId,
        cam.modelId,
      );

      reqs.add_type_to_individual(
        class_expression.cls(destNode.getTerm().id),
        srcNode.modelId,
        cam.modelId,
      );
    }
  }

  deleteIndividual(reqs, node) {
    if (node.modelId) {
      reqs.remove_individual(node.modelId);
    }
  }

  addEvidence(cam, srcNode, destNode) {
    this.noctuaConfigService.baristaToken
    let reqs = new minerva_requests.request_set(this.noctuaConfigService.baristaToken, cam.modelId);

    if (srcNode.hasValue() && destNode.hasValue()) {
      // let ce = new class_expression(destNode.term.control.value.id);
      reqs.remove_type_from_individual(
        class_expression.cls(srcNode.getTerm().id),
        srcNode.modelId,
        cam.modelId,
      );

      reqs.add_type_to_individual(
        class_expression.cls(destNode.getTerm().id),
        srcNode.modelId,
        cam.modelId,
      );

      cam.manager.user_token(this.noctuaConfigService.baristaToken);
      cam.manager.request_with(reqs);
    }
  }

  addFact(reqs, annoton, node) {
    let edge = annoton.getEdges(node.id);

    each(edge.nodes, function (edgeNode) {
      let subject = node.saveMeta.term;
      let object = edgeNode.object ? edgeNode.object.saveMeta.term : null;

      if (subject && object && edge) {
        if (edgeNode.object.edgeOption) {
          edgeNode.edge = edgeNode.object.edgeOption.selected
        }
        edgeNode.object.saveMeta.edge = reqs.add_fact([
          node.saveMeta.term,
          edgeNode.object.saveMeta.term,
          edgeNode.edge.id
        ]);


        if (edgeNode.object.id === 'gp') {
          each(node.evidence, function (evidence) {
            let evidenceReference = evidence.reference.control.value;
            let evidenceWith = evidence.with.control.value;

            reqs.add_evidence(evidence.evidence.control.value.id, evidenceReference, evidenceWith, edgeNode.object.saveMeta.edge);
          });
        } else {
          each(edgeNode.object.evidence, function (evidence) {
            let evidenceReference = evidence.reference.control.value;
            let evidenceWith = evidence.with.control.value;
            // if (edgeNode.object.aspect === 'P') {
            //  let gpNode = annoton.getGPNode();
            //  if (gpNode && gpNode.modelId) {
            // evidenceWith.push(gpNode.modelId)
            //  }
            // }
            reqs.add_evidence(evidence.evidence.control.value.id, evidenceReference, evidenceWith, edgeNode.object.saveMeta.edge);
          });
        }
      }
    });
  }


  evidenceUseGroups(reqs, evidence) {
    const self = this;
    let assignedBy = evidence.getAssignedBy();

    if (assignedBy) {
      reqs.use_groups(['http://purl.obolibrary.org/go/groups/' + assignedBy]);
    } else if (self.userInfo.groups.length > 0) {
      reqs.use_groups([self.userInfo.selectedGroup.id]);
    } else {
      reqs.use_groups([]);
    }
  }

  adjustBPOnly(annoton, srcEdge) {
    const self = this;
    let mfNode = annoton.getNode('mf');
    let bpNode = annoton.getNode('bp');



    if (mfNode && bpNode && annoton.annotonModelType === noctuaFormConfig.annotonModelType.options.bpOnly.name) {
      mfNode.displaySection = noctuaFormConfig.displaySection.fd;
      mfNode.displayGroup = noctuaFormConfig.displayGroup.mf;
      annoton.editEdge('mf', 'bp', srcEdge);
      bpNode.relationship = annoton.getEdge('mf', 'bp').edge;
    }
  }

  saveModelGroup(cam: Cam) {
    const self = this

    cam.manager.use_groups([self.userInfo.selectedGroup.id]);
  }

  saveModelAnnotation(cam, key, value) {
    const self = this;

    let annotations = cam.graph.get_annotations_by_key(key);
    let reqs = new minerva_requests.request_set(cam.manager.user_token(), cam.model.id);

    each(annotations, function (annotation) {
      reqs.remove_annotation_from_model(key, annotation.value())
    });

    reqs.add_annotation_to_model(key, value);
    cam.manager.request_with(reqs);
  }

  /*
  checkIfNodeExist(srcAnnoton) {
    const self = this;
    let infos = [];

    each(srcAnnoton.nodes, function (srcNode) {
      let srcTerm = srcNode.getTerm();

      if (srcTerm.id && !srcNode.modelId) {
        let meta = {
          aspect: srcNode.label,
          subjectNode: {
            node: srcNode,
            label: srcNode.term.control.value.label
          },
          linkedNodes: []
        }

        each(self.gridData.annotons, function (annotonData) {
          each(annotonData.annoton.nodes, function (node) {

            if (srcTerm.id === node.getTerm().id) {
              if (!_.find(meta.linkedNodes, {
                modelId: node.modelId
              })) {
                meta.linkedNodes.push(node);
              }
            }
          });
        });

        if (meta.linkedNodes.length > 0) {
          let info = new AnnotonError('error', 5, "Instance exists " + srcNode.term.control.value.label, meta);

          infos.push(info);
        }
      }

    });

    return infos;
  }
*/
  annotonAdjustments(annoton: Annoton) {
    const self = this;
    let infos = []; //self.checkIfNodeExist(annoton);

    switch (annoton.annotonModelType) {
      case noctuaFormConfig.annotonModelType.options.default.name:
        {
          let mfNode = annoton.getNode('mf');
          let ccNode = annoton.getNode('cc');
          let cc1Node = annoton.getNode('cc-1');
          let cc11Node = annoton.getNode('cc-1-1');
          let cc111Node = annoton.getNode('cc-1-1-1');

          if (!ccNode.hasValue()) {
            if (cc1Node.hasValue()) {
              let meta = {
                aspect: cc1Node.label,
                subjectNode: {
                  label: mfNode.term.control.value.label
                },
                edge: {
                  label: noctuaFormConfig.edge.occursIn
                },
                objectNode: {
                  label: cc1Node.term.control.value.label
                },
              }
              let info = new AnnotonError('error', 2, "No CC found, added  ", meta);

              infos.push(info);
            } else if (cc11Node.hasValue()) { }
          }
          break;
        }
      case noctuaFormConfig.annotonModelType.options.bpOnly.name:
        {
          let mfNode = annoton.getNode('mf');
          let bpNode = annoton.getNode('bp');

          break;
        }
    }
    return infos;
  }

  createSave(srcAnnoton: Annoton) {
    const self = this;
    let destAnnoton = new Annoton();
    destAnnoton.copyStructure(srcAnnoton);

    let skipNodeDFS = function (sourceId, objectId) {
      const self = this;
      let srcEdge = srcAnnoton.edges[objectId];

      if (srcEdge) {
        each(srcEdge.nodes, function (srcNode) {
          let nodeExist = destAnnoton.getNode(sourceId) && destAnnoton.getNode(srcNode.object.id);
          if (nodeExist && srcNode.object.hasValue()) {
            destAnnoton.addEdgeById(sourceId, srcNode.object.id, srcNode.edge);
          } else {
            skipNodeDFS(sourceId, srcNode.object.id);
          }
        });
      }
    }

    each(srcAnnoton.nodes, function (srcNode) {
      if (srcNode.hasValue()) {
        let destNode = srcNode;

        if (destAnnoton.annotonType === noctuaFormConfig.annotonType.options.simple.name) {
          if (srcNode.displayGroup.id !== noctuaFormConfig.displayGroup.mc.id) {
            destAnnoton.addNode(destNode);
          }
        } else {
          if (srcNode.id !== 'gp') {
            destAnnoton.addNode(destNode);
          }
        }
      }
    });

    forOwn(srcAnnoton.edges, function (srcEdge, key) {
      each(srcEdge.nodes, function (srcNode) {
        let nodeExist = destAnnoton.getNode(key);
        if (nodeExist && srcNode.object.hasValue()) {
          destAnnoton.addEdgeById(key, srcNode.object.id, srcNode.edge);
        } else {
          skipNodeDFS(key, srcNode.object.id);
        }
      });
    });

    console.log('create save', destAnnoton);

    return destAnnoton;
  }

  adjustAnnoton(annoton: Annoton) {
    const self = this;

    switch (annoton.annotonModelType) {
      case noctuaFormConfig.annotonModelType.options.default.name:
        {
          let mfNode = annoton.getNode('mf');
          let ccNode = annoton.getNode('cc');
          let cc1Node = annoton.getNode('cc-1');
          let cc11Node = annoton.getNode('cc-1-1');
          let cc111Node = annoton.getNode('cc-1-1-1');

          if (!ccNode.hasValue()) {
            if (cc1Node.hasValue()) {
              ccNode.setTerm(noctuaFormConfig.rootNode[ccNode.id]);
              ccNode.evidence = cc1Node.evidence;
            } else if (cc11Node.hasValue()) {
              ccNode.setTerm(noctuaFormConfig.rootNode[ccNode.id]);
              ccNode.evidence = cc11Node.evidence;
            } else if (cc111Node.hasValue()) {
              ccNode.setTerm(noctuaFormConfig.rootNode[ccNode.id]);
              ccNode.evidence = cc111Node.evidence;
            }
          }
          break;
        }
      case noctuaFormConfig.annotonModelType.options.bpOnly.name:
        {
          let mfNode = annoton.getNode('mf');
          let bpNode = annoton.getNode('bp');

          mfNode.setTerm({
            id: 'GO:0003674',
            label: 'molecular_function'
          });
          mfNode.evidence = bpNode.evidence;
          break;
        }
    }

    return self.createSave(annoton);
  }

  saveGP(cam, gp, success) {
    const self = this;

    let manager = new minerva_manager(
      cam.barista_location,
      cam.minerva_definition_name,
      cam.barista_token,
      cam.engine, 'async');

    manager.register('manager_error',
      function (resp) {
        console.log('There was a manager error (' +
          resp.message_type() + '): ' + resp.message());
      }, 10);

    manager.register('warning', function (resp) {
      alert('Warning: ' + resp.message() + '; ' +
        'your operation was likely not performed');
    }, 10);
    manager.register('error', function (resp) {
      let perm_flag = 'InsufficientPermissionsException';
      let token_flag = 'token';
      if (resp.message() && resp.message().indexOf(perm_flag) !== -1) {
        alert('Error: it seems like you do not have permission to ' +
          'perform that operation. Did you remember to login?');
      } else if (resp.message() && resp.message().indexOf(token_flag) !== -1) {
        alert('Error: it seems like you have a bad token...');
      } else {
        console.log('error:', resp, resp.message_type(), resp.message());
      }
    }, 10);
    manager.register('meta', function () {
      console.log('## a meta callback?');
    });

    manager.register('merge', function (resp) {
      let individuals = resp.individuals();
      if (individuals.length > 0) {
        let gpResponse = individuals[0];

        gp.modelId = gpResponse.id;
        success(gpResponse);
      }
    }, 10);

    let reqs = new minerva_requests.request_set(manager.user_token(), cam.model.id);
    reqs.add_individual(gp.getTerm().id);
    return manager.request_with(reqs);
  }

  saveAnnoton(cam, annoton) {
    const self = this;
    let geneProduct;

    if (annoton.annotonType === noctuaFormConfig.annotonType.options.complex.name) {
      geneProduct = annoton.getNode('mc');
    } else {
      geneProduct = annoton.getNode('gp');
    }

    function success() {
      const manager = cam.manager;
      let reqs = new minerva_requests.request_set(manager.user_token(), cam.model.id);

      if (!cam.modelTitle) {
        const defaultTitle = 'Model involving ' + geneProduct.term.control.value.label;
        reqs.add_annotation_to_model(annotationTitleKey, defaultTitle);
      }

      each(annoton.nodes, function (node) {
        self.addIndividual(reqs, node);
      });

      each(annoton.nodes, function (node) {
        self.addFact(reqs, annoton, node);
      });

      reqs.store_model(cam.model.id);

      if (self.userInfo.groups.length > 0) {
        reqs.use_groups([self.userInfo.selectedGroup.id]);
      }

      return manager.request_with(reqs);
    }

    //return self.saveGP(geneProduct, success);

    return success();

  }

  saveConnection(cam, annoton: Annoton, subjectNode: AnnotonNode, objectNode: AnnotonNode) {
    const self = this;

    function success() {
      const manager = cam.manager;
      let reqs = new minerva_requests.request_set(manager.user_token(), cam.model.id);

      self.addIndividual(reqs, subjectNode);
      self.addIndividual(reqs, objectNode);
      self.addFact(reqs, annoton, subjectNode);

      reqs.store_model(cam.model.id);

      if (self.userInfo.groups.length > 0) {
        reqs.use_groups([self.userInfo.selectedGroup.id]);
      }

      return manager.request_with(reqs);
    }

    //return self.saveGP(geneProduct, success);

    return success();

  }

  deleteAnnoton(annoton, ev) {
    const self = this;
  }


}