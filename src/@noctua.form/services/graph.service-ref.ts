import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, filter, reduce, catchError, retry, tap } from 'rxjs/operators';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';
import { CurieService } from '@noctua.curie/services/curie.service';


import Annoton from './annoton/annoton.js';
import AnnotonParser from './annoton/parser/annoton-parser.js';
import AnnotonError from "./annoton/parser/annoton-error.js";
import Evidence from './annoton/evidence.js';

const each = require('lodash/forEach');
const forOwn = require('lodash/forOwn');
const uuid = require('uuid/v1');
const annotationTitleKey = 'title';

var model = require('bbop-graph-noctua');
var amigo = require('amigo2');
var golr_response = require('bbop-response-golr');
var golr_manager = require('bbop-manager-golr');
var golr_conf = require("golr-conf");
var node_engine = require('bbop-rest-manager').node;
var barista_response = require('bbop-response-barista');
var minerva_requests = require('minerva-requests');
var jquery_engine = require('bbop-rest-manager').jquery;
var class_expression = require('class-expression');
var minerva_manager = require('bbop-manager-minerva');
var local_id = typeof global_id !== 'undefined' ? global_id : 'global_id';
var local_golr_server = typeof global_golr_server !== 'undefined' ? global_golr_server : 'global_id';
var local_barista_location = typeof global_barista_location !== 'undefined' ? global_barista_location : 'global_barista_location';
var local_minerva_definition_name = typeof global_minerva_definition_name !== 'undefined' ? global_minerva_definition_name : 'global_minerva_definition_name';
var local_barista_token = typeof global_barista_token !== 'undefined' ? global_barista_token : 'global_barista_token';
var local_collapsible_relations = typeof global_collapsible_relations !== 'undefined' ? global_collapsible_relations : 'global_collapsible_relations';




@Injectable({
  providedIn: 'root'
})
export class GraphService {
  baseUrl = environment.spaqrlApiUrl;
  curieUtil: any;
  cams: any[] = [];
  onCamsChanged: BehaviorSubject<any>;

  constructor(private httpClient: HttpClient, private curieService: CurieService) {
    this.onCamsChanged = new BehaviorSubject({});

    this.curieUtil = this.curieService.getCurieUtil();
  }

}
