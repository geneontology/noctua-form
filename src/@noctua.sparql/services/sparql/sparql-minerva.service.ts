import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


import { CurieService } from './../../../@noctua.curie/services/curie.service';
import {
  NoctuaFormConfigService,
  NoctuaUserService
} from 'noctua-form-base'


declare const require: any;

const barista_response = require('bbop-response-barista');
const minerva_requests = require('minerva-requests');
const jquery_engine = require('bbop-rest-manager').jquery;
const minerva_manager = require('bbop-manager-minerva');

@Injectable({
  providedIn: 'root'
})
export class SparqlMinervaService {
  minervaDefinitionName = environment.globalMinervaDefinitionName;
  separator = '@@';
  baseUrl = environment.spaqrlApiUrl;
  curieUtil: any;
  cams: any[] = [];
  loading: boolean = false;
  onCamsChanged: BehaviorSubject<any>;
  onCamChanged: BehaviorSubject<any>;
  onContributorFilterChanged: BehaviorSubject<any>;

  searchSummary: any = {}

  constructor(public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaUserService: NoctuaUserService,
    private curieService: CurieService) {
    this.onCamsChanged = new BehaviorSubject({});
    this.onCamChanged = new BehaviorSubject({});
    this.curieUtil = this.curieService.getCurieUtil();


  }

  registerManager() {
    let engine = new jquery_engine(barista_response);
    engine.method('POST');

    let manager = new minerva_manager(
      environment.globalBaristaLocation,
      this.minervaDefinitionName,
      null,
      engine, 'async');


    let managerError = (resp) => {
      console.log('There was a manager error (' +
        resp.message_type() + '): ' + resp.message());
    }

    let warning = (resp) => {
      alert('Warning: ' + resp.message() + '; ' +
        'your operation was likely not performed');
    }

    let error = (resp) => {
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
          //  cam.error = true
        }
      }
    }

    let shieldsUp = () => { }

    manager.register('prerun', shieldsUp);
    manager.register('postrun', () => {
    }, 9);
    manager.register('manager_error', managerError, 10);
    manager.register('warning', warning, 10);
    manager.register('error', error, 10);
    manager.register('meta', function (resp) {
      console.log("---------", resp)
    }, 10);

    return manager;
  }

  foo(query) {

    let manager = this.registerManager();

    var req = new minerva_requests.request('meta', 'sparql')
    req.special('query', query)
    var request_set = new minerva_requests.request_set('MYTOKEN', null);
    request_set.add(req);

    manager.request_with(request_set);
  }

}
