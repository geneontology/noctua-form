export const globalWorkbenchesModel = [
  {
    'menu-name': 'Noctua Form 2.0',
    'page-name': 'Noctua Form 2.0',
    'type': 'model',
    'help-link': 'https://github.com/geneontology/noctua-form/issues',
    'javascript': [
      'main.js'
    ],
    'css': [

    ],
    'workbench-id': 'noctua-form',
    'template-injectable': '../noctua-form/workbenches/noctua-form/public/inject.tmpl',
    'public-directory': '../noctua-form/workbenches/noctua-form/public'
  },
  {
    'menu-name': 'Noctua form Legacy',
    'page-name': 'Noctua form 1.0',
    'type': 'model',
    'help-link': 'http://github.com/geneontology/noctua-form-legacy/issues',
    'javascript': [
      'bundle.js'
    ],
    'css': [

    ],
    'workbench-id': 'noctua-form-legacy',
    'template-injectable': '../noctua-form-legacy/workbenches/noctua-form-legacy/public/inject.tmpl',
    'public-directory': '../noctua-form-legacy/workbenches/noctua-form-legacy/public'
  },
  {
    'menu-name': 'Annotation preview',
    'page-name': 'Annotation Preview',
    'type': 'model',
    'help-link': 'http://github.com/geneontology/noctua/issues',
    'javascript': [
      'AnnPreviewBundle.js',
      'jquery.dataTables.min.js'
    ],
    'css': [
      'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css'
    ],
    'workbench-id': 'annpreview',
    'template-injectable': 'workbenches/annpreview/public/inject.tmpl',
    'public-directory': 'workbenches/annpreview/public'
  },
  {
    'menu-name': 'Function companion',
    'page-name': 'Function Companion',
    'type': 'model',
    'help-link': 'http://github.com/geneontology/noctua/issues',
    'javascript': [
      'CompanionBundle.js'
    ],
    'css': [

    ],
    'workbench-id': 'companion',
    'template-injectable': 'workbenches/companion/public/inject.tmpl',
    'public-directory': 'workbenches/companion/public'
  },
  {
    'menu-name': 'Cytoscape layout tool',
    'page-name': 'Cytoscape Layout Tool',
    'type': 'model',
    'help-link': 'http://github.com/geneontology/noctua/issues',
    'javascript': [
      'CytoViewBundle.js'
    ],
    'css': [

    ],
    'workbench-id': 'cytoview',
    'template-injectable': 'workbenches/cytoview/public/inject.tmpl',
    'public-directory': 'workbenches/cytoview/public'
  },
  {
    'menu-name': 'Gosling (Noctua\'s little GOOSE)',
    'page-name': 'Gosling (Noctua\'s little GOOSE)',
    'type': 'model',
    'help-link': 'http://github.com/geneontology/noctua/issues',
    'javascript': [
      'http://cdn.jsdelivr.net/yasqe/2.11.10/yasqe.bundled.min.js',
      'http://cdn.jsdelivr.net/yasr/2.10.8/yasr.bundled.min.js',
      'GoslingModelBundle.js'
    ],
    'css': [
      'http://cdn.jsdelivr.net/yasqe/2.11.10/yasqe.min.css',
      'http://cdn.jsdelivr.net/yasr/2.10.8/yasr.min.css'
    ],
    'workbench-id': 'gosling-model',
    'template-injectable': 'workbenches/gosling-model/public/inject.tmpl',
    'public-directory': 'workbenches/gosling-model/public'
  },
  {
    'menu-name': 'Inference explanations',
    'page-name': 'Inference explanations',
    'type': 'model',
    'help-link': 'http://github.com/geneontology/noctua/issues',
    'javascript': [
      'InferredRelationsBundle.js',
      'jquery.dataTables.min.js'
    ],
    'css': [
      'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css'
    ],
    'workbench-id': 'inferredrelations',
    'template-injectable': 'workbenches/inferredrelations/public/inject.tmpl',
    'public-directory': 'workbenches/inferredrelations/public'
  },
  {
    'menu-name': 'Macromolecular complex creator',
    'page-name': 'Macromolecular Complex Creator',
    'type': 'model',
    'help-link': 'http://github.com/geneontology/noctua/issues',
    'javascript': [
      'MMCCBundle.js'
    ],
    'css': [
      'selectize.bootstrap3.css',
      'override-selectize.css'
    ],
    'workbench-id': 'mmcc',
    'template-injectable': 'workbenches/mmcc/public/inject.tmpl',
    'public-directory': 'workbenches/mmcc/public'
  },
  {
    'menu-name': 'Pathway view',
    'page-name': 'Pathway View',
    'type': 'model',
    'help-link': 'http://github.com/geneontology/noctua/issues',
    'javascript': [
      'PathwayViewBundle.js'
    ],
    'css': [

    ],
    'workbench-id': 'pathwayview',
    'template-injectable': 'workbenches/pathwayview/public/inject.tmpl',
    'public-directory': 'workbenches/pathwayview/public'
  }
];

export const globalWorkbenchesUniversal = [
  {
    'menu-name': 'Noctua Landing Page',
    'page-name': 'Noctua Landing Page',
    'type': 'universal',
    'help-link': 'https://github.com/geneontology/noctua-landing-page/issues',
    'workbench-id': 'noctua-landing-page',
    'template-injectable': '../noctua-landing-page/workbenches/noctua-landing-page/public/inject.tmpl',
    'public-directory': '../noctua-landing-page/workbenches/noctua-landing-page/public'
  },
  {
    'menu-name': 'Noctua Annotation Review',
    'page-name': 'Noctua Annotation Review',
    'type': 'universal',
    'help-link': 'https://github.com/geneontology/noctua-annotation-review/issues',
    'workbench-id': 'noctua-annotation-review',
    'template-injectable': '../noctua-annotation-review/workbenches/noctua-annotation-review/public/inject.tmpl',
    'public-directory': '../noctua-annotation-review/workbenches/noctua-annotation-review/public'
  },
  {
    'menu-name': 'Noctua Search',
    'page-name': 'Noctua Search',
    'type': 'universal',
    'help-link': 'https://github.com/geneontology/noctua-search/issues',
    'workbench-id': 'noctua-search',
    'template-injectable': '../noctua-search/workbenches/noctua-search/public/inject.tmpl',
    'public-directory': '../noctua-search/workbenches/noctua-search/public'
  },
  {
    'menu-name': 'Model count (template)',
    'page-name': 'Model Count',
    'type': 'universal',
    'help-link': 'http://github.com/geneontology/noctua/issues',
    'javascript': [
      'http://vuejs.org/js/vue.min.js',
      'foo.js'
    ],
    'workbench-id': 'count',
    'template-injectable': 'workbenches/count/public/inject.tmpl',
    'public-directory': 'workbenches/count/public'
  },
  {
    'menu-name': 'Gosling (Noctua\'s little GOOSE)',
    'page-name': 'Gosling (Noctua\'s little GOOSE)',
    'type': 'universal',
    'help-link': 'http://github.com/geneontology/noctua/issues',
    'javascript': [
      'http://cdn.jsdelivr.net/yasqe/2.11.10/yasqe.bundled.min.js',
      'http://cdn.jsdelivr.net/yasr/2.10.8/yasr.bundled.min.js',
      'GoslingUniversalBundle.js'
    ],
    'css': [
      'http://cdn.jsdelivr.net/yasqe/2.11.10/yasqe.min.css',
      'http://cdn.jsdelivr.net/yasr/2.10.8/yasr.min.css'
    ],
    'workbench-id': 'gosling-universal',
    'template-injectable': 'workbenches/gosling-universal/public/inject.tmpl',
    'public-directory': 'workbenches/gosling-universal/public'
  }
] 
