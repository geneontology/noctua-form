import { environment } from 'environments/environment';
import { Injectable } from '@angular/core'

import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, filter, reduce, catchError, retry, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { AnnotonNode } from './../annoton/annoton-node.js';
import { AnnotonNodeClosure } from './../annoton/annoton-node-closure';
import { Evidence } from './../annoton/evidence.js';

import { NoctuaFormConfigService } from './config/noctua-form-config.service';

declare const require: any;

const each = require('lodash/forEach');
const bbop = require('bbop-core');
const amigo = require('amigo2');
const golr_conf = require('golr-conf');
const gconf = new golr_conf.conf(amigo.data.golr);
const gserv = "http://golr.berkeleybop.org/";
const impl_engine = require('bbop-rest-manager').jquery;
const golr_manager = require('bbop-manager-golr');
const golr_response = require('bbop-response-golr');
const engine = new impl_engine(golr_response);
engine.use_jsonp(true)


@Injectable({
  providedIn: 'root'
})
export class NoctuaLookupService {
  name;
  linker;
  golrURLBase;
  localClosures;

  constructor(private httpClient: HttpClient,
    private noctuaFormConfigService: NoctuaFormConfigService) {
    this.name = 'DefaultLookupName';
    this.linker = new amigo.linker();
    this.golrURLBase = environment.globalGolrServer + `/select?`;
    // this.trusted = this.$sce.trustAsResourceUrl(this.golrURLBase);

    this.localClosures = [];

    //  this.golrLookupManager();

  }

  goLookup() {

  }



  escapeGolrValue(str) {
    var pattern = /([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\/"])/g;
    return str.replace(pattern, "\\$1");
  }

  buildQ(str) {
    let manager = new golr_manager(gserv, gconf, engine, 'async');

    manager.set_comfy_query(str);
    return manager.get_query(str);
  }

  golrTermLookup(searchText, id) {
    const self = this;

    let requestParams = self.noctuaFormConfigService.getRequestParams(id);

    return self.golrLookup(searchText, requestParams);
  }

  golrLookup(searchText, requestParams) {
    const self = this;

    requestParams.q = self.buildQ(searchText);

    let params = new HttpParams({
      fromObject: requestParams
    })
    // .set('callback', 'JSONP_CALLBACK')
    //.set('jsonpCallbackParam', 'json.wrf')
    // .set('params', requestParams);


    const url = this.golrURLBase + params.toString();

    return this.httpClient.jsonp(url, 'json.wrf').pipe(
      map(response => self._foo(response))
    );
  }

  _foo(response) {
    let data = response.response.docs;
    let result = data.map((item) => {
      return {
        id: item.annotation_class,
        label: item.annotation_class_label
      };
    });
    return result;
  }

  golrLookupManager(searchText, requestParams) {
    const self = this;
    let manager = new golr_manager(gserv, gconf, engine, 'async');
    // manager.jsonpCallbackParam: 'json.wrf'

    manager.set_query(searchText);
    manager.set_personality('annotation');
    manager.add_query_filter('document_category', 'ontology_class', ['*']);
    manager.add_query_filter('isa_closure', 'CHEBI:33695');

    var promise = manager.search();
    promise.then(function (response) {

      // Process our response instance using bbop-response-golr.
      if (response.success()) {
        var data = response.documents();
        var result = data.map(function (item) {
          return {
            id: item.annotation_class,
            label: item.annotation_class_label
          };
        });

        return result;
      }
    });
  }

  /*
  companionLookup(gp, aspect, params) {
    const self = this;
    let deferred = self.$q.defer();

    let requestParams = {
      defType: 'edismax',
      qt: 'standard',
      indent: 'on',
      wt: 'json',
      sort: 'annotation_class_label asc',
      rows: 100,
      start: 0,
      fl: "*,score",
      facet: true,
      'facet.mincount': 1,
      'facet.sort': 'count',
      'json.nl': 'arrarr',
      "facet.limit": 100,
      fq: [
        'document_category: "annotation"',
        'aspect: "' + aspect + '"',
        'bioentity: "' + gp + '"'
      ],
      'facet.field': [
        'source',
        'assigned_by',
        'aspect',
        'evidence_type_closure',
        // 'panther_family_label',
        // 'qualifier',
        // 'taxon_label',
        'annotation_class_label',
        //'regulates_closure_label',
        // 'annotation_extension_class_closure_label'
      ],
      q: '*:*',
      packet: '1',
      callback_type: 'search',
      _: Date.now()
    }

    if (params.term) {
      requestParams.fq.push('annotation_class:"' + params.term + '"')
    }

    if (params.evidence) {
      requestParams.fq.push('evidence:"' + params.evidence + '"')
    }

    self.$http.jsonp(
      self.$sce.trustAsResourceUrl('http://golr.berkeleybop.org/select'), {
        // withCredentials: false,
        jsonpCallbackParam: 'json.wrf',
        params: requestParams
      })
      .then(function (response) {
        var docs = response.data.response.docs;
        let result = {};
        let annoton
        // console.log('poo', data);

        each(docs, function (doc) {
          let annotonNode = new AnnotonNode();
          let evidence = new Evidence();

          evidence.setEvidence({
            id: doc.evidence,
            label: doc.evidence_label
          });

          if (doc.reference && doc.reference.length > 0) {
            evidence.setReference(doc.reference[0], self.linker.url(doc.reference[0]));
          }

          if (doc.evidence_with && doc.evidence_with.length > 0) {
            evidence.setWith(doc.evidence_with[0], self.linker.url(doc.evidence_with[0]));
          }

          evidence.setAssignedBy(doc.assigned_by);

          annotonNode.setTerm({
            id: doc.annotation_class,
            label: doc.annotation_class_label
          })
          annotonNode.evidence[0] = evidence;

          if (!result[doc.annotation_class]) {
            result[doc.annotation_class] = {};
            result[doc.annotation_class].term = annotonNode.getTerm();
            result[doc.annotation_class].annotations = [];
          }
          result[doc.annotation_class].annotations.push(annotonNode);

        });

        deferred.resolve(result);
      },
        function (error) {
          console.log('Companion Lookup: ', error);
          deferred.reject(error);
        }
      ).catch(function (response) {
        deferred.reject(response);
      });;

    return deferred.promise;
  }
  */

  isaClosure(a, b) {
    const self = this;

    let requestParams = {
      q: self.buildQ(b),
      defType: 'edismax',
      indent: 'on',
      qt: 'standard',
      wt: 'json',
      rows: '2',
      start: '0',
      fl: '*,score',
      'facet': 'true',
      'facet.mincount': '1',
      'facet.sort': 'count',
      'facet.limit': '25',
      'json.nl': 'arrarr',
      packet: '1',
      callback_type: 'search',
      'facet.field': [
        'source',
        'subset',
        'idspace',
        'is_obsolete'
      ],
      fq: [
        'document_category:"ontology_class"',
        'isa_closure:' + '"' + a + '"'
      ],
      qf: [
        'annotation_class^3',
        //'annotation_class_label_searchable^5.5',
        //'description_searchable^1',
        //'comment_searchable^0.5',
        //'synonym_searchable^1',
        // 'alternate_id^1',
        'isa_closure^1',
        //'regulates_closure_label_searchable^1'
      ],
      // _: Date.now()
    };
    let params = new HttpParams({
      fromObject: requestParams
    })
    // .set('callback', 'JSONP_CALLBACK')
    //.set('jsonpCallbackParam', 'json.wrf')
    // .set('params', requestParams);


    const url = this.golrURLBase + params.toString();

    return this.httpClient.jsonp(url, 'json.wrf').pipe(
      map(response => {
        let data = response["response"].docs;
        let result = data.length > 0;
        return result;
      }))
  }

  ensureUnderscores(curie) {
    return curie.replace(/:/, '_');
  }

  ensureColons(curie) {
    return curie.replace(/_/, ':');
  }

  //Closures
  addLocalClosure(term, closure, isaClosure) {
    const self = this;
    let data = {
      term: term,
      closure: closure,
      isaClosure: isaClosure
    }

    if (!self.localClosureExist(term, closure)) {
      self.localClosures.push(data);
    }
  }

  localClosureExist(term, closure) {
    const self = this;
    let data = new AnnotonNodeClosure(term, closure);

    return (_.find(self.localClosures, data));
  }

  getLocalClosure(term, closure) {
    const self = this;
    let data = self.localClosureExist(term, closure);

    if (data) {
      return data.isaClosure;
    } else {
      //we4 don't know locally
      return undefined;
    }
  }

  getLocalClosureRange(term, closureRange) {
    const self = this;
    let result;

    if (closureRange) {
      each(closureRange.closures, function (closure) {
        if (closure.object) {
          let data = self.localClosureExist(term, closure.object.id);
          if (data && data.isaClosure) {
            result = data;
          }
        }
      });
    }

    return result;
  }

  getAllLocalClosures() {
    const self = this;

    return self.localClosures;
  }
}