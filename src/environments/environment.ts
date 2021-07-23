// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import * as enviromnenetData from './environment-data';

declare var global_barista_location: any;
declare var global_minerva_definition_name: any;
declare var global_golr_neo_server: any;
declare var global_golr_server: any;
declare var global_workbenches_universal: any;
declare var global_workbenches_model: any;

const baristaLocation = typeof global_barista_location !== 'undefined' ? global_barista_location : 'http://barista-dev.berkeleybop.org';
const minervaDefinitionName = typeof global_minerva_definition_name !== 'undefined' ? global_minerva_definition_name : 'minerva_public_dev';
const golrNeoServer = typeof global_golr_neo_server !== 'undefined'
  ? global_golr_neo_server
  : 'http://noctua-golr.berkeleybop.org/';
const golrServer = typeof global_golr_server !== 'undefined'
  ? global_golr_server
  : 'http://golr.berkeleybop.org/';

const globalWorkbenchesModel = typeof global_workbenches_model !== 'undefined'
  ? global_workbenches_model
  : enviromnenetData.globalWorkbenchesModel;
const globalWorkbenchesUniversal = typeof global_workbenches_universal !== 'undefined'
  ? global_workbenches_universal
  : enviromnenetData.globalWorkbenchesUniversal;


export const environment = {
  production: false,
  spaqrlApiUrl: 'http://rdf-internal.berkeleybop.io/blazegraph/sparql',
  // spaqrlApiUrl: 'http://rdf.geneontology.org/blazegraph/sparql',
  // gorestApiUrl: 'https://api.geneontology.cloud/'
  gorestApiUrl: 'http://localhost:3000/',
  globalGolrNeoServer: golrNeoServer,
  globalGolrServer: golrServer,
  globalMinervaDefinitionName: minervaDefinitionName,
  globalBaristaLocation: baristaLocation,
  globalWorkbenchesModel: globalWorkbenchesModel,
  globalWorkbenchesUniversal: globalWorkbenchesUniversal,
  searchApi: `${baristaLocation}/search/`,

  //Workbench
  noctuaUrl: `${window.location.origin}`,
  workbenchUrl: `${window.location.origin}/workbench/`,

  amigoTerm: 'http://amigo.geneontology.org/amigo/term/',
  wikidataSparqlUrl: 'https://query.wikidata.org/sparql',
  pubMedSummaryApi: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id='
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
