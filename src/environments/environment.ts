// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  spaqrlApiUrl: 'http://rdf.geneontology.org/blazegraph/sparql',
  // gorestApiUrl: 'https://api.geneontology.cloud/'
  gorestApiUrl: 'http://localhost:3000/',
  globalGolrServer: ' http://noctua-golr.berkeleybop.org/',//'http://amigo-dev-golr.berkeleybop.org/',
  globalGolrCompanionServer: ' http://golr.berkeleybop.org/',
  globalGolrNeoServer: 'http://noctua-golr.berkeleybop.org/',
  globalMinervaDefinitionName: 'minerva_public_dev',
  globalBaristaLocation: 'http://barista-dev.berkeleybop.org',
  //Workbench
  noctuaUrl: 'http://noctua-dev.berkeleybop.org/',
  workbenchUrl: 'http://noctua-dev.berkeleybop.org//workbench/',

  locationStoreApi: 'https://6xq2j25tah.execute-api.us-east-1.amazonaws.com/dev'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
