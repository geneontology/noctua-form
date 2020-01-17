// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


declare var global_barista_location: any;

const baristaLocation = typeof global_barista_location !== 'undefined' ? global_barista_location : 'http://barista-dev.berkeleybop.org';

export const environment = {
  production: true,
  spaqrlApiUrl: 'http://rdf-internal.berkeleybop.io/blazegraph/sparql',
  // spaqrlApiUrl: 'http://rdf.geneontology.org/blazegraph/sparql',
  // gorestApiUrl: 'https://api.geneontology.cloud/'
  gorestApiUrl: 'http://localhost:3000/',
  globalGolrServer: ' http://noctua-golr.berkeleybop.org/',
  globalGolrCompanionServer: ' http://golr.berkeleybop.org/',
  globalGolrNeoServer: 'http://noctua-golr.berkeleybop.org/',
  globalMinervaDefinitionName: 'minerva_public_dev',
  globalBaristaLocation: baristaLocation,
  //Workbench
  noctuaUrl: `${window.location.origin}`,
  workbenchUrl: `${window.location.origin}/workbench/`, //'http://noctua-dev.berkeleybop.org/workbench/',

  amigoTerm: 'http://amigo.geneontology.org/amigo/term/',
  wikidataSparqlUrl: 'https://query.wikidata.org/sparql',
  pubMedSummaryApi: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id='
};

