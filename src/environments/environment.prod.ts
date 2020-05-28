// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import * as enviromnenetData from './environment-data';

declare var global_barista_location: any;
declare var global_minerva_definition_name: any;
declare var global_workbenches_universal: any;
declare var global_workbenches_model: any;

const baristaLocation = typeof global_barista_location !== 'undefined' ? global_barista_location : 'http://barista-dev.berkeleybop.org';
const minervaDefinitionName = typeof global_minerva_definition_name !== 'undefined' ? global_minerva_definition_name : 'minerva_public_dev';
const globalWorkbenchesModel = typeof global_workbenches_model !== 'undefined'
  ? global_workbenches_model
  : enviromnenetData.globalWorkbenchesModel;
const globalWorkbenchesUniversal = typeof global_workbenches_universal !== 'undefined'
  ? global_workbenches_universal
  : enviromnenetData.globalWorkbenchesUniversal;


export const environment = {
  production: true,
  spaqrlApiUrl: 'http://rdf-internal.berkeleybop.io/blazegraph/sparql',
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

