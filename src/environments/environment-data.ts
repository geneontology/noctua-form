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


export const globalWorkbenchesModelBetaTest =
  [{ "menu-name": "Noctua Form (Beta)", "page-name": "Noctua Form (Beta)", "type": "model", "is-beta": true, "help-link": "https://github.com/geneontology/noctua-form/issues", "javascript": ["main.js"], "css": [], "workbench-id": "noctua-form-beta", "template-injectable": "../noctua-form/workbenches/noctua-form-beta/public/inject.tmpl", "public-directory": "../noctua-form/workbenches/noctua-form-beta/public" }];
export const globalWorkbenchesUniversalBetaTest = [
  {
    'menu-name': 'Noctua Landing Page',
    'page-name': 'Noctua Landing Page',
    'type': 'universal',
    "is-beta": true,
    'help-link': 'https://github.com/geneontology/noctua-landing-page/issues',
    'workbench-id': 'noctua-landing-page',
    'template-injectable': '../noctua-landing-page/workbenches/noctua-landing-page/public/inject.tmpl',
    'public-directory': '../noctua-landing-page/workbenches/noctua-landing-page/public'
  },
  {
    'menu-name': 'Noctua Annotation Review',
    'page-name': 'Noctua Annotation Review',
    'type': 'universal',
    "is-beta": true,
    'help-link': 'https://github.com/geneontology/noctua-annotation-review/issues',
    'workbench-id': 'noctua-annotation-review',
    'template-injectable': '../noctua-annotation-review/workbenches/noctua-annotation-review/public/inject.tmpl',
    'public-directory': '../noctua-annotation-review/workbenches/noctua-annotation-review/public'
  }
]

export const globalKnownRelations = [
  {
    "id": "BFO:0000050",
    "label": "part of",
    "relevant": true
  },
  {
    "id": "BFO:0000051",
    "label": "has part",
    "relevant": false
  },
  {
    "id": "BFO:0000054",
    "label": "realized in",
    "relevant": false
  },
  {
    "id": "BFO:0000055",
    "label": "realizes",
    "relevant": false
  },
  {
    "id": "BFO:0000056",
    "relevant": false
  },
  {
    "id": "BFO:0000060",
    "label": "obsolete preceded by",
    "relevant": false
  },
  {
    "id": "BFO:0000062",
    "label": "preceded_by",
    "relevant": false
  },
  {
    "id": "BFO:0000063",
    "label": "precedes",
    "relevant": false
  },
  {
    "id": "BFO:0000066",
    "label": "occurs in",
    "relevant": true
  },
  {
    "id": "BFO:0000067",
    "label": "contains process",
    "relevant": false
  },
  {
    "id": "BFO:0000068",
    "relevant": false
  },
  {
    "id": "BFO:0000069",
    "relevant": false
  },
  {
    "id": "BFO:0000070",
    "relevant": false
  },
  {
    "id": "BSPO:0000096",
    "label": "anterior_to",
    "relevant": false
  },
  {
    "id": "BSPO:0000097",
    "label": "distal_to",
    "relevant": false
  },
  {
    "id": "BSPO:0000098",
    "label": "dorsal_to",
    "relevant": false
  },
  {
    "id": "BSPO:0000099",
    "label": "posterior_to",
    "relevant": false
  },
  {
    "id": "BSPO:0000100",
    "label": "proximal_to",
    "relevant": false
  },
  {
    "id": "BSPO:0000102",
    "label": "ventral_to",
    "relevant": false
  },
  {
    "id": "BSPO:0000107",
    "label": "deep_to",
    "relevant": false
  },
  {
    "id": "BSPO:0000108",
    "label": "superficial_to",
    "relevant": false
  },
  {
    "id": "BSPO:0000120",
    "label": "in_left_side_of",
    "relevant": false
  },
  {
    "id": "BSPO:0000121",
    "label": "in_right_side_of",
    "relevant": false
  },
  {
    "id": "BSPO:0000122",
    "label": "in_posterior_side_of",
    "relevant": false
  },
  {
    "id": "BSPO:0000123",
    "label": "in_anterior_side_of",
    "relevant": false
  },
  {
    "id": "BSPO:0000124",
    "label": "in_proximal_side_of",
    "relevant": false
  },
  {
    "id": "BSPO:0000125",
    "label": "in_distal_side_of",
    "relevant": false
  },
  {
    "id": "BSPO:0000126",
    "label": "in_lateral_side_of",
    "relevant": false
  },
  {
    "id": "BSPO:0001100",
    "label": "in_superficial_part_of",
    "relevant": false
  },
  {
    "id": "BSPO:0001101",
    "label": "in_deep_part_of",
    "relevant": false
  },
  {
    "id": "BSPO:0001106",
    "label": "proximalmost_part_of",
    "relevant": false
  },
  {
    "id": "BSPO:0001107",
    "label": "immediately_deep_to",
    "relevant": false
  },
  {
    "id": "BSPO:0001108",
    "label": "distalmost_part_of",
    "relevant": false
  },
  {
    "id": "BSPO:0001113",
    "label": "preaxialmost_part_of",
    "relevant": false
  },
  {
    "id": "BSPO:0001114",
    "label": "postaxial_to",
    "relevant": false
  },
  {
    "id": "BSPO:0001115",
    "label": "postaxialmost_part_of",
    "relevant": false
  },
  {
    "id": "BSPO:0005001",
    "label": "intersects_midsagittal_plane_of",
    "relevant": false
  },
  {
    "id": "BSPO:0015009",
    "label": "immediately_anterior_to",
    "relevant": false
  },
  {
    "id": "BSPO:0015012",
    "label": "immediately_posterior_to",
    "relevant": false
  },
  {
    "id": "BSPO:0015014",
    "label": "immediately_superficial_to",
    "relevant": false
  },
  {
    "id": "BSPO:0015101",
    "label": "in_dorsal_side_of",
    "relevant": false
  },
  {
    "id": "BSPO:0015102",
    "label": "in_ventral_side_of",
    "relevant": false
  },
  {
    "id": "BSPO:0015201",
    "label": "oral_to",
    "relevant": false
  },
  {
    "id": "BSPO:0015202",
    "label": "aboral_to",
    "relevant": false
  },
  {
    "id": "BSPO:1000000",
    "label": "preaxial_to",
    "relevant": false
  },
  {
    "id": "ECO:9000000",
    "label": "used_in",
    "relevant": false
  },
  {
    "id": "ECO:9000001",
    "label": "uses",
    "relevant": false
  },
  {
    "id": "obo:GOREL_0000040",
    "label": "results_in",
    "relevant": false
  },
  {
    "id": "obo:GOREL_0001006",
    "label": "acts_on_population_of",
    "relevant": false
  },
  {
    "id": "obo:GOREL_0001019",
    "label": "results_in_division_of",
    "relevant": false
  },
  {
    "id": "obo:GOREL_0002001",
    "label": "obsolete results_in_assembly_of",
    "relevant": false
  },
  {
    "id": "obo:GOREL_0002002",
    "label": "obsolete results_in_disassembly_of",
    "relevant": false
  },
  {
    "id": "obo:GOREL_0002003",
    "label": "results_in_distribution_of",
    "relevant": false
  },
  {
    "id": "obo:GOREL_0002004",
    "label": "results_in_fission_of",
    "relevant": false
  },
  {
    "id": "obo:GOREL_0002005",
    "label": "results_in_fusion_of",
    "relevant": false
  },
  {
    "id": "obo:GOREL_0002006",
    "label": "obsolete results_in_organization_of",
    "relevant": false
  },
  {
    "id": "obo:GOREL_0002007",
    "label": "obsolete results_in_remodeling_of",
    "relevant": false
  },
  {
    "id": "obo:GOREL_0002008",
    "label": "obsolete has intermediate",
    "relevant": false
  },
  {
    "id": "obo:GOREL_0012006",
    "label": "results_in_maintenance_of",
    "relevant": false
  },
  {
    "id": "IAO:0000136",
    "label": "is about",
    "relevant": false
  },
  {
    "id": "obo:LEGOREL_0000000",
    "label": "lego relation",
    "relevant": false
  },
  {
    "id": "RO:0000052",
    "label": "inheres in",
    "relevant": false
  },
  {
    "id": "RO:0000053",
    "label": "bearer of",
    "relevant": false
  },
  {
    "id": "RO:0000056",
    "label": "participates in",
    "relevant": false
  },
  {
    "id": "RO:0000057",
    "label": "has_participant",
    "relevant": false
  },
  {
    "id": "RO:0000058",
    "label": "is concretized as",
    "relevant": false
  },
  {
    "id": "RO:0000059",
    "label": "concretizes",
    "relevant": false
  },
  {
    "id": "RO:0000079",
    "label": "function of",
    "relevant": false
  },
  {
    "id": "RO:0000080",
    "label": "quality of",
    "relevant": false
  },
  {
    "id": "RO:0000081",
    "label": "role of",
    "relevant": false
  },
  {
    "id": "RO:0000085",
    "label": "has function",
    "relevant": false
  },
  {
    "id": "RO:0000086",
    "label": "has quality",
    "relevant": false
  },
  {
    "id": "RO:0000087",
    "label": "has role",
    "relevant": false
  },
  {
    "id": "RO:0000091",
    "label": "has disposition",
    "relevant": false
  },
  {
    "id": "RO:0000092",
    "label": "disposition of",
    "relevant": false
  },
  {
    "id": "RO:0000300",
    "label": "obsolete in neural circuit with",
    "relevant": false
  },
  {
    "id": "RO:0000301",
    "label": "obsolete upstream in neural circuit with",
    "relevant": false
  },
  {
    "id": "RO:0000302",
    "label": "obsolete downstream in neural circuit with",
    "relevant": false
  },
  {
    "id": "RO:0001000",
    "label": "derives_from",
    "relevant": false
  },
  {
    "id": "RO:0001001",
    "label": "derives into",
    "relevant": false
  },
  {
    "id": "RO:0001015",
    "label": "location_of",
    "relevant": false
  },
  {
    "id": "RO:0001018",
    "label": "contained in",
    "relevant": false
  },
  {
    "id": "RO:0001019",
    "label": "contains",
    "relevant": false
  },
  {
    "id": "RO:0001020",
    "label": "is allergic trigger for",
    "relevant": false
  },
  {
    "id": "RO:0001021",
    "label": "is autoimmune trigger for",
    "relevant": false
  },
  {
    "id": "RO:0001022",
    "label": "has allergic trigger",
    "relevant": false
  },
  {
    "id": "RO:0001023",
    "label": "has autoimmune trigger",
    "relevant": false
  },
  {
    "id": "RO:0001025",
    "label": "located_in",
    "relevant": false
  },
  {
    "id": "RO:0002000",
    "label": "boundary of",
    "relevant": false
  },
  {
    "id": "RO:0002001",
    "label": "aligned with",
    "relevant": false
  },
  {
    "id": "RO:0002002",
    "label": "has boundary",
    "relevant": false
  },
  {
    "id": "RO:0002003",
    "label": "electrically_synapsed_to",
    "relevant": false
  },
  {
    "id": "RO:0002004",
    "label": "tracheates",
    "relevant": false
  },
  {
    "id": "RO:0002005",
    "label": "innervated_by",
    "relevant": false
  },
  {
    "id": "RO:0002006",
    "label": "has synaptic terminal of",
    "relevant": false
  },
  {
    "id": "RO:0002007",
    "label": "bounding layer of",
    "relevant": false
  },
  {
    "id": "RO:0002008",
    "label": "coincident with",
    "relevant": false
  },
  {
    "id": "RO:0002009",
    "label": "cell expresses",
    "relevant": false
  },
  {
    "id": "RO:0002010",
    "label": "regulates in other organism",
    "relevant": false
  },
  {
    "id": "RO:0002011",
    "label": "regulates transport of",
    "relevant": false
  },
  {
    "id": "RO:0002012",
    "label": "occurent part of",
    "relevant": false
  },
  {
    "id": "RO:0002013",
    "label": "has regulatory component activity",
    "relevant": false
  },
  {
    "id": "RO:0002014",
    "label": "has negative regulatory component activity",
    "relevant": false
  },
  {
    "id": "RO:0002015",
    "label": "has positive regulatory component activity",
    "relevant": false
  },
  {
    "id": "RO:0002016",
    "label": "has necessary component activity",
    "relevant": false
  },
  {
    "id": "RO:0002017",
    "label": "has component activity",
    "relevant": false
  },
  {
    "id": "RO:0002018",
    "label": "has component process",
    "relevant": false
  },
  {
    "id": "RO:0002019",
    "label": "has ligand",
    "relevant": false
  },
  {
    "id": "RO:0002020",
    "label": "transports",
    "relevant": false
  },
  {
    "id": "RO:0002021",
    "label": "occurs across",
    "relevant": false
  },
  {
    "id": "RO:0002022",
    "label": "directly regulated by",
    "relevant": false
  },
  {
    "id": "RO:0002023",
    "label": "directly negatively regulated by",
    "relevant": false
  },
  {
    "id": "RO:0002024",
    "label": "directly positively regulated by",
    "relevant": false
  },
  {
    "id": "RO:0002025",
    "label": "has effector activity",
    "relevant": false
  },
  {
    "id": "RO:0002026",
    "label": "in register with",
    "relevant": false
  },
  {
    "id": "RO:0002081",
    "label": "before or simultaneous with",
    "relevant": false
  },
  {
    "id": "RO:0002082",
    "label": "simultaneous with",
    "relevant": false
  },
  {
    "id": "RO:0002083",
    "label": "before",
    "relevant": false
  },
  {
    "id": "RO:0002084",
    "label": "during which ends",
    "relevant": false
  },
  {
    "id": "RO:0002085",
    "label": "encompasses",
    "relevant": false
  },
  {
    "id": "RO:0002086",
    "label": "ends after",
    "relevant": false
  },
  {
    "id": "RO:0002087",
    "label": "immediately preceded by",
    "relevant": false
  },
  {
    "id": "RO:0002088",
    "label": "during which starts",
    "relevant": false
  },
  {
    "id": "RO:0002089",
    "label": "starts before",
    "relevant": false
  },
  {
    "id": "RO:0002090",
    "label": "immediately_precedes",
    "relevant": false
  },
  {
    "id": "RO:0002091",
    "label": "starts_during",
    "relevant": false
  },
  {
    "id": "RO:0002092",
    "label": "happens during",
    "relevant": false
  },
  {
    "id": "RO:0002093",
    "label": "ends_during",
    "relevant": false
  },
  {
    "id": "RO:0002100",
    "label": "has soma location",
    "relevant": false
  },
  {
    "id": "RO:0002101",
    "label": "fasciculates with",
    "relevant": false
  },
  {
    "id": "RO:0002102",
    "label": "axon synapses in",
    "relevant": false
  },
  {
    "id": "RO:0002103",
    "label": "synapsed by",
    "relevant": false
  },
  {
    "id": "RO:0002104",
    "label": "has plasma membrane part",
    "relevant": false
  },
  {
    "id": "RO:0002105",
    "label": "synapsed_via_type_Ib_bouton_to",
    "relevant": false
  },
  {
    "id": "RO:0002106",
    "label": "synapsed_via_type_Is_bouton_to",
    "relevant": false
  },
  {
    "id": "RO:0002107",
    "label": "synapsed_via_type_II_bouton_to",
    "relevant": false
  },
  {
    "id": "RO:0002108",
    "label": "synapsed_by_via_type_II_bouton",
    "relevant": false
  },
  {
    "id": "RO:0002109",
    "label": "synapsed_by_via_type_Ib_bouton",
    "relevant": false
  },
  {
    "id": "RO:0002110",
    "label": "has postsynaptic terminal in",
    "relevant": false
  },
  {
    "id": "RO:0002111",
    "label": "releases neurotransmitter",
    "relevant": false
  },
  {
    "id": "RO:0002112",
    "label": "synapsed_by_via_type_Is_bouton",
    "relevant": false
  },
  {
    "id": "RO:0002113",
    "label": "has presynaptic terminal in",
    "relevant": false
  },
  {
    "id": "RO:0002114",
    "label": "synapsed_via_type_III_bouton_to",
    "relevant": false
  },
  {
    "id": "RO:0002115",
    "label": "synapsed_by_via_type_III_bouton",
    "relevant": false
  },
  {
    "id": "RO:0002120",
    "label": "synapsed to",
    "relevant": false
  },
  {
    "id": "RO:0002121",
    "label": "dendrite synapsed in",
    "relevant": false
  },
  {
    "id": "RO:0002130",
    "label": "has synaptic terminal in",
    "relevant": false
  },
  {
    "id": "RO:0002131",
    "label": "overlaps",
    "relevant": false
  },
  {
    "id": "RO:0002132",
    "label": "has fasciculating neuron projection",
    "relevant": false
  },
  {
    "id": "RO:0002134",
    "label": "innervates",
    "relevant": false
  },
  {
    "id": "RO:0002150",
    "label": "continuous with",
    "relevant": false
  },
  {
    "id": "RO:0002151",
    "label": "partially overlaps",
    "relevant": false
  },
  {
    "id": "RO:0002156",
    "label": "derived by descent from",
    "relevant": false
  },
  {
    "id": "RO:0002157",
    "label": "has derived by descendant",
    "relevant": false
  },
  {
    "id": "RO:0002158",
    "label": "homologous_to",
    "relevant": false
  },
  {
    "id": "RO:0002159",
    "label": "serially_homologous_to",
    "relevant": false
  },
  {
    "id": "RO:0002160",
    "label": "only in taxon",
    "relevant": false
  },
  {
    "id": "RO:0002162",
    "label": "in taxon",
    "relevant": false
  },
  {
    "id": "RO:0002163",
    "label": "spatially disjoint from",
    "relevant": false
  },
  {
    "id": "RO:0002170",
    "label": "connected to",
    "relevant": false
  },
  {
    "id": "RO:0002176",
    "label": "connects",
    "relevant": false
  },
  {
    "id": "RO:0002177",
    "label": "attached to part of",
    "relevant": false
  },
  {
    "id": "RO:0002178",
    "label": "supplies",
    "relevant": false
  },
  {
    "id": "RO:0002179",
    "label": "drains",
    "relevant": false
  },
  {
    "id": "RO:0002180",
    "label": "has component",
    "relevant": false
  },
  {
    "id": "RO:0002200",
    "label": "has phenotype",
    "relevant": false
  },
  {
    "id": "RO:0002201",
    "label": "phenotype of",
    "relevant": false
  },
  {
    "id": "RO:0002202",
    "label": "develops from",
    "relevant": false
  },
  {
    "id": "RO:0002203",
    "label": "develops into",
    "relevant": false
  },
  {
    "id": "RO:0002204",
    "label": "gene product of",
    "relevant": false
  },
  {
    "id": "RO:0002205",
    "label": "has gene product",
    "relevant": false
  },
  {
    "id": "RO:0002206",
    "label": "expressed in",
    "relevant": false
  },
  {
    "id": "RO:0002207",
    "label": "directly develops from",
    "relevant": false
  },
  {
    "id": "RO:0002208",
    "label": "parasitoid of",
    "relevant": false
  },
  {
    "id": "RO:0002209",
    "label": "has parasitoid",
    "relevant": false
  },
  {
    "id": "RO:0002210",
    "label": "directly develops into",
    "relevant": false
  },
  {
    "id": "RO:0002211",
    "label": "regulates",
    "relevant": false
  },
  {
    "id": "RO:0002212",
    "label": "negatively regulates",
    "relevant": false
  },
  {
    "id": "RO:0002213",
    "label": "positively regulates",
    "relevant": false
  },
  {
    "id": "RO:0002214",
    "label": "has prototype",
    "relevant": false
  },
  {
    "id": "RO:0002215",
    "label": "capable of",
    "relevant": false
  },
  {
    "id": "RO:0002216",
    "label": "capable of part of",
    "relevant": false
  },
  {
    "id": "RO:0002217",
    "label": "obsolete actively participates in",
    "relevant": false
  },
  {
    "id": "RO:0002218",
    "label": "obsolete has active participant",
    "relevant": false
  },
  {
    "id": "RO:0002219",
    "label": "surrounded by",
    "relevant": false
  },
  {
    "id": "RO:0002220",
    "label": "adjacent_to",
    "relevant": false
  },
  {
    "id": "RO:0002221",
    "label": "surrounds",
    "relevant": false
  },
  {
    "id": "RO:0002222",
    "label": "temporally related to",
    "relevant": false
  },
  {
    "id": "RO:0002223",
    "label": "starts",
    "relevant": false
  },
  {
    "id": "RO:0002224",
    "label": "starts with",
    "relevant": true
  },
  {
    "id": "RO:0002225",
    "label": "develops from part of",
    "relevant": false
  },
  {
    "id": "RO:0002226",
    "label": "develops_in",
    "relevant": false
  },
  {
    "id": "RO:0002227",
    "label": "obligate parasite of",
    "relevant": false
  },
  {
    "id": "RO:0002228",
    "label": "facultative parasite of",
    "relevant": false
  },
  {
    "id": "RO:0002229",
    "label": "ends",
    "relevant": false
  },
  {
    "id": "RO:0002230",
    "label": "ends with",
    "relevant": true
  },
  {
    "id": "RO:0002231",
    "label": "has start location",
    "relevant": false
  },
  {
    "id": "RO:0002232",
    "label": "has end location",
    "relevant": false
  },
  {
    "id": "RO:0002233",
    "label": "has input",
    "relevant": true
  },
  {
    "id": "RO:0002234",
    "label": "has output",
    "relevant": true
  },
  {
    "id": "RO:0002235",
    "label": "stem parasite of",
    "relevant": false
  },
  {
    "id": "RO:0002236",
    "label": "root parasite of",
    "relevant": false
  },
  {
    "id": "RO:0002237",
    "label": "hemiparasite of",
    "relevant": false
  },
  {
    "id": "RO:0002240",
    "label": "has exposure receptor",
    "relevant": false
  },
  {
    "id": "RO:0002241",
    "label": "has exposure stressor",
    "relevant": false
  },
  {
    "id": "RO:0002242",
    "label": "has exposure route",
    "relevant": false
  },
  {
    "id": "RO:0002243",
    "label": "has exposure transport path",
    "relevant": false
  },
  {
    "id": "RO:0002244",
    "label": "related via exposure to",
    "relevant": false
  },
  {
    "id": "RO:0002245",
    "label": "over-expressed in",
    "relevant": false
  },
  {
    "id": "RO:0002246",
    "label": "under-expressed in",
    "relevant": false
  },
  {
    "id": "RO:0002248",
    "label": "has active ingredient",
    "relevant": false
  },
  {
    "id": "RO:0002249",
    "label": "active ingredient in",
    "relevant": false
  },
  {
    "id": "RO:0002252",
    "label": "connecting branch of",
    "relevant": false
  },
  {
    "id": "RO:0002253",
    "label": "has connecting branch",
    "relevant": false
  },
  {
    "id": "RO:0002254",
    "label": "has developmental contribution from",
    "relevant": false
  },
  {
    "id": "RO:0002255",
    "label": "developmentally_contributes_to",
    "relevant": false
  },
  {
    "id": "RO:0002256",
    "label": "developmentally induced by",
    "relevant": false
  },
  {
    "id": "RO:0002257",
    "label": "developmentally induces",
    "relevant": false
  },
  {
    "id": "RO:0002258",
    "label": "developmentally preceded by",
    "relevant": false
  },
  {
    "id": "RO:0002260",
    "label": "has biological role",
    "relevant": false
  },
  {
    "id": "RO:0002261",
    "label": "has application role",
    "relevant": false
  },
  {
    "id": "RO:0002262",
    "label": "has chemical role",
    "relevant": false
  },
  {
    "id": "RO:0002263",
    "label": "acts upstream of",
    "relevant": false
  },
  {
    "id": "RO:0002264",
    "label": "acts upstream of or within",
    "relevant": false
  },
  {
    "id": "RO:0002285",
    "label": "developmentally replaces",
    "relevant": false
  },
  {
    "id": "RO:0002286",
    "label": "developmentally succeeded by",
    "relevant": false
  },
  {
    "id": "RO:0002287",
    "label": "part of developmental precursor of",
    "relevant": false
  },
  {
    "id": "RO:0002291",
    "label": "ubiquitously expressed in",
    "relevant": false
  },
  {
    "id": "RO:0002292",
    "label": "expresses",
    "relevant": false
  },
  {
    "id": "RO:0002293",
    "label": "ubiquitously expresses",
    "relevant": false
  },
  {
    "id": "RO:0002295",
    "label": "results in developmental progression of",
    "relevant": false
  },
  {
    "id": "RO:0002296",
    "label": "results in development of",
    "relevant": false
  },
  {
    "id": "RO:0002297",
    "label": "results in formation of",
    "relevant": false
  },
  {
    "id": "RO:0002298",
    "label": "results in morphogenesis of",
    "relevant": false
  },
  {
    "id": "RO:0002299",
    "label": "results in maturation of",
    "relevant": false
  },
  {
    "id": "RO:0002300",
    "label": "results in disappearance of",
    "relevant": false
  },
  {
    "id": "RO:0002301",
    "label": "results in developmental regression of",
    "relevant": false
  },
  {
    "id": "RO:0002302",
    "label": "is treated by substance",
    "relevant": false
  },
  {
    "id": "RO:0002303",
    "label": "has habitat",
    "relevant": false
  },
  {
    "id": "RO:0002304",
    "label": "causally upstream of with a positive effect",
    "relevant": false
  },
  {
    "id": "RO:0002305",
    "label": "causally upstream of with a negative effect",
    "relevant": false
  },
  {
    "id": "RO:0002309",
    "label": "has exposure stimulus",
    "relevant": false
  },
  {
    "id": "RO:0002312",
    "label": "evolutionary variant of",
    "relevant": false
  },
  {
    "id": "RO:0002313",
    "label": "transports or maintains localization of",
    "relevant": false
  },
  {
    "id": "RO:0002314",
    "label": "inheres in part of",
    "relevant": false
  },
  {
    "id": "RO:0002315",
    "label": "results in acquisition of features of",
    "relevant": false
  },
  {
    "id": "RO:0002320",
    "label": "evolutionarily related to",
    "relevant": false
  },
  {
    "id": "RO:0002321",
    "label": "ecologically related to",
    "relevant": false
  },
  {
    "id": "RO:0002322",
    "label": "confers advantage in",
    "relevant": false
  },
  {
    "id": "RO:0002323",
    "label": "mereotopologically related to",
    "relevant": false
  },
  {
    "id": "RO:0002324",
    "label": "developmentally related to",
    "relevant": false
  },
  {
    "id": "RO:0002325",
    "label": "colocalizes with",
    "relevant": false
  },
  {
    "id": "RO:0002326",
    "label": "contributes_to",
    "relevant": false
  },
  {
    "id": "RO:0002327",
    "label": "enables",
    "relevant": false
  },
  {
    "id": "RO:0002328",
    "label": "functionally related to",
    "relevant": false
  },
  {
    "id": "RO:0002329",
    "label": "part of structure that is capable of",
    "relevant": false
  },
  {
    "id": "RO:0002330",
    "label": "genomically related to",
    "relevant": false
  },
  {
    "id": "RO:0002331",
    "label": "involved in",
    "relevant": false
  },
  {
    "id": "RO:0002332",
    "label": "regulates levels of",
    "relevant": false
  },
  {
    "id": "RO:0002333",
    "label": "enabled by",
    "relevant": true
  },
  {
    "id": "RO:0002334",
    "label": "regulated by",
    "relevant": false
  },
  {
    "id": "RO:0002335",
    "label": "negatively regulated by",
    "relevant": false
  },
  {
    "id": "RO:0002336",
    "label": "positively regulated by",
    "relevant": false
  },
  {
    "id": "RO:0002337",
    "label": "related via localization to",
    "relevant": false
  },
  {
    "id": "RO:0002338",
    "label": "has target start location",
    "relevant": false
  },
  {
    "id": "RO:0002339",
    "label": "has_target_end_location",
    "relevant": false
  },
  {
    "id": "RO:0002340",
    "label": "imports",
    "relevant": false
  },
  {
    "id": "RO:0002341",
    "label": "results in transport along",
    "relevant": false
  },
  {
    "id": "RO:0002342",
    "label": "results in transport across",
    "relevant": false
  },
  {
    "id": "RO:0002343",
    "label": "results in growth of",
    "relevant": false
  },
  {
    "id": "RO:0002344",
    "label": "results in transport to from or in",
    "relevant": false
  },
  {
    "id": "RO:0002345",
    "label": "exports",
    "relevant": false
  },
  {
    "id": "RO:0002348",
    "label": "results in commitment to",
    "relevant": false
  },
  {
    "id": "RO:0002349",
    "label": "results in determination of",
    "relevant": false
  },
  {
    "id": "RO:0002350",
    "label": "member of",
    "relevant": false
  },
  {
    "id": "RO:0002351",
    "label": "has member",
    "relevant": false
  },
  {
    "id": "RO:0002352",
    "label": "input of",
    "relevant": false
  },
  {
    "id": "RO:0002353",
    "label": "output of",
    "relevant": false
  },
  {
    "id": "RO:0002354",
    "label": "formed as result of",
    "relevant": false
  },
  {
    "id": "RO:0002355",
    "label": "results in structural organization of",
    "relevant": false
  },
  {
    "id": "RO:0002356",
    "label": "results in specification of",
    "relevant": false
  },
  {
    "id": "RO:0002357",
    "label": "results in developmental induction of",
    "relevant": false
  },
  {
    "id": "RO:0002360",
    "label": "has dendrite location",
    "relevant": false
  },
  {
    "id": "RO:0002371",
    "label": "attached to",
    "relevant": false
  },
  {
    "id": "RO:0002372",
    "label": "has_muscle_origin",
    "relevant": false
  },
  {
    "id": "RO:0002373",
    "label": "has_muscle_insertion",
    "relevant": false
  },
  {
    "id": "RO:0002374",
    "label": "derived from ancestral fusion of",
    "relevant": false
  },
  {
    "id": "RO:0002375",
    "label": "in branching relationship with",
    "relevant": false
  },
  {
    "id": "RO:0002376",
    "label": "tributary_of",
    "relevant": false
  },
  {
    "id": "RO:0002377",
    "label": "distributary of",
    "relevant": false
  },
  {
    "id": "RO:0002378",
    "label": "anabranch of",
    "relevant": false
  },
  {
    "id": "RO:0002379",
    "label": "spatially coextensive with",
    "relevant": false
  },
  {
    "id": "RO:0002380",
    "label": "branching part of",
    "relevant": false
  },
  {
    "id": "RO:0002381",
    "label": "main stem of",
    "relevant": false
  },
  {
    "id": "RO:0002382",
    "label": "proper distributary of",
    "relevant": false
  },
  {
    "id": "RO:0002383",
    "label": "proper tributary of",
    "relevant": false
  },
  {
    "id": "RO:0002384",
    "label": "has developmental potential involving",
    "relevant": false
  },
  {
    "id": "RO:0002385",
    "label": "has potential to developmentally contribute to",
    "relevant": false
  },
  {
    "id": "RO:0002386",
    "label": "has potential to developmentally induce",
    "relevant": false
  },
  {
    "id": "RO:0002387",
    "label": "has potential to develop into",
    "relevant": false
  },
  {
    "id": "RO:0002388",
    "label": "has potential to directly develop into",
    "relevant": false
  },
  {
    "id": "RO:0002400",
    "label": "has direct input",
    "relevant": false
  },
  {
    "id": "RO:0002401",
    "label": "obsolete has indirect input",
    "relevant": false
  },
  {
    "id": "RO:0002402",
    "label": "obsolete has direct output",
    "relevant": false
  },
  {
    "id": "RO:0002403",
    "label": "obsolete has indirect output",
    "relevant": false
  },
  {
    "id": "RO:0002404",
    "label": "causally downstream of",
    "relevant": false
  },
  {
    "id": "RO:0002405",
    "label": "immediately causally downstream of",
    "relevant": false
  },
  {
    "id": "RO:0002406",
    "label": "directly activates (process to process)",
    "relevant": true
  },
  {
    "id": "RO:0002407",
    "label": "indirectly activates",
    "relevant": false
  },
  {
    "id": "RO:0002408",
    "label": "directly inhibits (process to process)",
    "relevant": true
  },
  {
    "id": "RO:0002409",
    "label": "indirectly inhibits",
    "relevant": false
  },
  {
    "id": "RO:0002410",
    "label": "causally related to",
    "relevant": false
  },
  {
    "id": "RO:0002411",
    "label": "causally upstream of",
    "relevant": false
  },
  {
    "id": "RO:0002412",
    "label": "immediately causally upstream of",
    "relevant": false
  },
  {
    "id": "RO:0002413",
    "label": "directly provides input for (process to process)",
    "relevant": true
  },
  {
    "id": "RO:0002414",
    "label": "transitively provides input for",
    "relevant": false
  },
  {
    "id": "RO:0002418",
    "label": "causally upstream of or within",
    "relevant": false
  },
  {
    "id": "RO:0002424",
    "label": "differs in",
    "relevant": false
  },
  {
    "id": "RO:0002425",
    "label": "differs in attribute of",
    "relevant": false
  },
  {
    "id": "RO:0002426",
    "label": "differs in attribute",
    "relevant": false
  },
  {
    "id": "RO:0002427",
    "label": "causally downstream of or within",
    "relevant": false
  },
  {
    "id": "RO:0002428",
    "label": "involved in regulation of",
    "relevant": false
  },
  {
    "id": "RO:0002429",
    "label": "involved in positive regulation of",
    "relevant": false
  },
  {
    "id": "RO:0002430",
    "label": "involved in negative regulation of",
    "relevant": false
  },
  {
    "id": "RO:0002431",
    "label": "involved in or involved in regulation of",
    "relevant": false
  },
  {
    "id": "RO:0002432",
    "label": "is active in",
    "relevant": false
  },
  {
    "id": "RO:0002433",
    "label": "contributes to morphology of",
    "relevant": false
  },
  {
    "id": "RO:0002434",
    "label": "interacts with",
    "relevant": false
  },
  {
    "id": "RO:0002435",
    "label": "genetically interacts with",
    "relevant": false
  },
  {
    "id": "RO:0002436",
    "label": "molecularly interacts with",
    "relevant": false
  },
  {
    "id": "RO:0002437",
    "label": "biotically interacts with",
    "relevant": false
  },
  {
    "id": "RO:0002438",
    "label": "trophically interacts with",
    "relevant": false
  },
  {
    "id": "RO:0002439",
    "label": "preys on",
    "relevant": false
  },
  {
    "id": "RO:0002440",
    "label": "symbiotically interacts with",
    "relevant": false
  },
  {
    "id": "RO:0002441",
    "label": "commensually interacts with",
    "relevant": false
  },
  {
    "id": "RO:0002442",
    "label": "mutualistically interacts with",
    "relevant": false
  },
  {
    "id": "RO:0002443",
    "label": "interacts with via parasite-host interaction",
    "relevant": false
  },
  {
    "id": "RO:0002444",
    "label": "parasite of",
    "relevant": false
  },
  {
    "id": "RO:0002445",
    "label": "parasitized by",
    "relevant": false
  },
  {
    "id": "RO:0002446",
    "label": "participates in a abiotic-biotic interaction with",
    "relevant": false
  },
  {
    "id": "RO:0002447",
    "label": "phosphorylates",
    "relevant": false
  },
  {
    "id": "RO:0002448",
    "label": "directly regulates activity of",
    "relevant": false
  },
  {
    "id": "RO:0002449",
    "label": "directly negatively regulates activity of",
    "relevant": false
  },
  {
    "id": "RO:0002450",
    "label": "directly positively regulates activity of",
    "relevant": false
  },
  {
    "id": "RO:0002451",
    "label": "transmitted by",
    "relevant": false
  },
  {
    "id": "RO:0002452",
    "label": "has symptom",
    "relevant": false
  },
  {
    "id": "RO:0002453",
    "label": "host of",
    "relevant": false
  },
  {
    "id": "RO:0002454",
    "label": "has host",
    "relevant": false
  },
  {
    "id": "RO:0002455",
    "label": "pollinates",
    "relevant": false
  },
  {
    "id": "RO:0002456",
    "label": "pollinated by",
    "relevant": false
  },
  {
    "id": "RO:0002457",
    "label": "acquires nutrients from",
    "relevant": false
  },
  {
    "id": "RO:0002458",
    "label": "preyed upon by",
    "relevant": false
  },
  {
    "id": "RO:0002459",
    "label": "is vector for",
    "relevant": false
  },
  {
    "id": "RO:0002460",
    "label": "has vector",
    "relevant": false
  },
  {
    "id": "RO:0002461",
    "label": "partner in",
    "relevant": false
  },
  {
    "id": "RO:0002462",
    "label": "subject participant in",
    "relevant": false
  },
  {
    "id": "RO:0002463",
    "label": "target participant in",
    "relevant": false
  },
  {
    "id": "RO:0002464",
    "label": "helper property (not for use in curation)",
    "relevant": false
  },
  {
    "id": "RO:0002465",
    "label": "is symbiosis",
    "relevant": false
  },
  {
    "id": "RO:0002466",
    "label": "is commensalism",
    "relevant": false
  },
  {
    "id": "RO:0002467",
    "label": "is mutualism",
    "relevant": false
  },
  {
    "id": "RO:0002468",
    "label": "is parasitism",
    "relevant": false
  },
  {
    "id": "RO:0002469",
    "label": "provides nutrients for",
    "relevant": false
  },
  {
    "id": "RO:0002470",
    "label": "eats",
    "relevant": false
  },
  {
    "id": "RO:0002471",
    "label": "is eaten by",
    "relevant": false
  },
  {
    "id": "RO:0002472",
    "label": "is evidence for",
    "relevant": false
  },
  {
    "id": "RO:0002473",
    "label": "composed primarily of",
    "relevant": false
  },
  {
    "id": "RO:0002476",
    "label": "child nucleus of",
    "relevant": false
  },
  {
    "id": "RO:0002477",
    "label": "child nucleus of in hermaphrodite",
    "relevant": false
  },
  {
    "id": "RO:0002478",
    "label": "child nucleus of in male",
    "relevant": false
  },
  {
    "id": "RO:0002479",
    "label": "has part that occurs in",
    "relevant": false
  },
  {
    "id": "RO:0002480",
    "label": "ubiquitinates",
    "relevant": false
  },
  {
    "id": "RO:0002481",
    "label": "is kinase activity",
    "relevant": false
  },
  {
    "id": "RO:0002482",
    "label": "is ubiquitination",
    "relevant": false
  },
  {
    "id": "RO:0002485",
    "label": "receives input from",
    "relevant": false
  },
  {
    "id": "RO:0002486",
    "label": "sends output to",
    "relevant": false
  },
  {
    "id": "RO:0002487",
    "label": "relation between physical entity and a process or stage",
    "relevant": false
  },
  {
    "id": "RO:0002488",
    "label": "existence starts during",
    "relevant": false
  },
  {
    "id": "RO:0002489",
    "label": "existence starts with",
    "relevant": false
  },
  {
    "id": "RO:0002490",
    "label": "existence overlaps",
    "relevant": false
  },
  {
    "id": "RO:0002491",
    "label": "existence starts and ends during",
    "relevant": false
  },
  {
    "id": "RO:0002492",
    "label": "existence ends during",
    "relevant": false
  },
  {
    "id": "RO:0002493",
    "label": "existence ends with",
    "relevant": false
  },
  {
    "id": "RO:0002494",
    "label": "transformation of",
    "relevant": false
  },
  {
    "id": "RO:0002495",
    "label": "immediate transformation of",
    "relevant": false
  },
  {
    "id": "RO:0002496",
    "label": "existence starts during or after",
    "relevant": false
  },
  {
    "id": "RO:0002497",
    "label": "existence ends during or before",
    "relevant": false
  },
  {
    "id": "RO:0002500",
    "label": "causal agent in process",
    "relevant": false
  },
  {
    "id": "RO:0002501",
    "label": "causal relation between processes",
    "relevant": false
  },
  {
    "id": "RO:0002502",
    "label": "depends on",
    "relevant": false
  },
  {
    "id": "RO:0002503",
    "label": "towards",
    "relevant": false
  },
  {
    "id": "RO:0002505",
    "label": "has intermediate",
    "relevant": false
  },
  {
    "id": "RO:0002506",
    "label": "causal relation between entities",
    "relevant": false
  },
  {
    "id": "RO:0002507",
    "label": "determined by",
    "relevant": false
  },
  {
    "id": "RO:0002508",
    "label": "determines",
    "relevant": false
  },
  {
    "id": "RO:0002509",
    "label": "determined by part of",
    "relevant": false
  },
  {
    "id": "RO:0002510",
    "label": "transcribed from",
    "relevant": false
  },
  {
    "id": "RO:0002511",
    "label": "transcribed to",
    "relevant": false
  },
  {
    "id": "RO:0002512",
    "label": "ribosomal translation of",
    "relevant": false
  },
  {
    "id": "RO:0002513",
    "label": "ribosomally translates to",
    "relevant": false
  },
  {
    "id": "RO:0002514",
    "label": "sequentially related to",
    "relevant": false
  },
  {
    "id": "RO:0002515",
    "label": "sequentially adjacent to",
    "relevant": false
  },
  {
    "id": "RO:0002516",
    "label": "has start sequence",
    "relevant": false
  },
  {
    "id": "RO:0002517",
    "label": "is start sequence of",
    "relevant": false
  },
  {
    "id": "RO:0002518",
    "label": "has end sequence",
    "relevant": false
  },
  {
    "id": "RO:0002519",
    "label": "is end sequence of",
    "relevant": false
  },
  {
    "id": "RO:0002520",
    "label": "is consecutive sequence of",
    "relevant": false
  },
  {
    "id": "RO:0002521",
    "label": "is sequentially aligned with",
    "relevant": false
  },
  {
    "id": "RO:0002522",
    "label": "bounds sequence of",
    "relevant": false
  },
  {
    "id": "RO:0002523",
    "label": "is bound by sequence of",
    "relevant": false
  },
  {
    "id": "RO:0002524",
    "label": "has subsequence",
    "relevant": false
  },
  {
    "id": "RO:0002525",
    "label": "is subsequence of",
    "relevant": false
  },
  {
    "id": "RO:0002526",
    "label": "overlaps sequence of",
    "relevant": false
  },
  {
    "id": "RO:0002527",
    "label": "does not overlap sequence of",
    "relevant": false
  },
  {
    "id": "RO:0002528",
    "label": "is upstream of sequence of",
    "relevant": false
  },
  {
    "id": "RO:0002529",
    "label": "is downstream of sequence of",
    "relevant": false
  },
  {
    "id": "RO:0002530",
    "label": "is immediately downstream of sequence of",
    "relevant": false
  },
  {
    "id": "RO:0002531",
    "label": "is immediately upstream of sequence of",
    "relevant": false
  },
  {
    "id": "RO:0002551",
    "label": "has skeleton",
    "relevant": false
  },
  {
    "id": "RO:0002552",
    "label": "results in ending of",
    "relevant": false
  },
  {
    "id": "RO:0002553",
    "label": "hyperparasite of",
    "relevant": false
  },
  {
    "id": "RO:0002554",
    "label": "hyperparasitized by",
    "relevant": false
  },
  {
    "id": "RO:0002555",
    "label": "allelopath of",
    "relevant": false
  },
  {
    "id": "RO:0002556",
    "label": "pathogen of",
    "relevant": false
  },
  {
    "id": "RO:0002557",
    "label": "has pathogen",
    "relevant": false
  },
  {
    "id": "RO:0002558",
    "label": "has evidence",
    "relevant": false
  },
  {
    "id": "RO:0002559",
    "label": "causally influenced by",
    "relevant": false
  },
  {
    "id": "RO:0002563",
    "label": "interaction relation helper property",
    "relevant": false
  },
  {
    "id": "RO:0002564",
    "label": "molecular interaction relation helper property",
    "relevant": false
  },
  {
    "id": "RO:0002565",
    "label": "results in movement of",
    "relevant": false
  },
  {
    "id": "RO:0002566",
    "label": "causally influences",
    "relevant": false
  },
  {
    "id": "RO:0002567",
    "label": "biomechanically related to",
    "relevant": false
  },
  {
    "id": "RO:0002568",
    "label": "has_muscle_antagonist",
    "relevant": false
  },
  {
    "id": "RO:0002569",
    "label": "has branching part",
    "relevant": false
  },
  {
    "id": "RO:0002570",
    "label": "conduit for",
    "relevant": false
  },
  {
    "id": "RO:0002571",
    "label": "lumen of",
    "relevant": false
  },
  {
    "id": "RO:0002572",
    "label": "luminal space of",
    "relevant": false
  },
  {
    "id": "RO:0002573",
    "label": "has modifier",
    "relevant": false
  },
  {
    "id": "RO:0002574",
    "label": "participates in a biotic-biotic interaction with",
    "relevant": false
  },
  {
    "id": "RO:0002576",
    "label": "skeleton of",
    "relevant": false
  },
  {
    "id": "RO:0002578",
    "label": "directly regulates",
    "relevant": false
  },
  {
    "id": "RO:0002583",
    "label": "existence starts at end of",
    "relevant": false
  },
  {
    "id": "RO:0002584",
    "label": "has part structure that is capable of",
    "relevant": false
  },
  {
    "id": "RO:0002585",
    "label": "results in closure of",
    "relevant": false
  },
  {
    "id": "RO:0002586",
    "label": "results in breakdown of",
    "relevant": false
  },
  {
    "id": "RO:0002587",
    "label": "results in synthesis of",
    "relevant": false
  },
  {
    "id": "RO:0002588",
    "label": "results in assembly of",
    "relevant": false
  },
  {
    "id": "RO:0002589",
    "label": "results in catabolism of",
    "relevant": false
  },
  {
    "id": "RO:0002590",
    "label": "results in disassembly of",
    "relevant": false
  },
  {
    "id": "RO:0002591",
    "label": "results in remodeling of",
    "relevant": false
  },
  {
    "id": "RO:0002592",
    "label": "results_in_organization_of",
    "relevant": false
  },
  {
    "id": "RO:0002593",
    "label": "existence ends at start of",
    "relevant": false
  },
  {
    "id": "RO:0002595",
    "label": "causal relation between material entity and a process",
    "relevant": false
  },
  {
    "id": "RO:0002596",
    "label": "capable of regulating",
    "relevant": false
  },
  {
    "id": "RO:0002597",
    "label": "capable of negatively regulating",
    "relevant": false
  },
  {
    "id": "RO:0002598",
    "label": "capable of positively regulating",
    "relevant": false
  },
  {
    "id": "RO:0002599",
    "label": "capable of inhibiting or preventing pathological process",
    "relevant": false
  },
  {
    "id": "RO:0002600",
    "label": "capable of upregulating or causing pathological process",
    "relevant": false
  },
  {
    "id": "RO:0002606",
    "label": "is substance that treats",
    "relevant": false
  },
  {
    "id": "RO:0002607",
    "label": "is marker for",
    "relevant": false
  },
  {
    "id": "RO:0002608",
    "label": "process has causal agent",
    "relevant": false
  },
  {
    "id": "RO:0002609",
    "label": "obsolete related via dependence to",
    "relevant": false
  },
  {
    "id": "RO:0002610",
    "label": "correlated with",
    "relevant": false
  },
  {
    "id": "RO:0002614",
    "label": "is evidence with support from",
    "relevant": true
  },
  {
    "id": "RO:0002615",
    "label": "has model",
    "relevant": false
  },
  {
    "id": "RO:0002616",
    "label": "related via evidence or inference to",
    "relevant": false
  },
  {
    "id": "RO:0002618",
    "label": "visits",
    "relevant": false
  },
  {
    "id": "RO:0002619",
    "label": "visited by",
    "relevant": false
  },
  {
    "id": "RO:0002622",
    "label": "visits flowers of",
    "relevant": false
  },
  {
    "id": "RO:0002623",
    "label": "has flowers visited by",
    "relevant": false
  },
  {
    "id": "RO:0002624",
    "label": "lays eggs in",
    "relevant": false
  },
  {
    "id": "RO:0002625",
    "label": "has eggs laid in by",
    "relevant": false
  },
  {
    "id": "RO:0002626",
    "label": "kills",
    "relevant": false
  },
  {
    "id": "RO:0002627",
    "label": "is killed by",
    "relevant": false
  },
  {
    "id": "RO:0002629",
    "label": "directly positively regulates",
    "relevant": false
  },
  {
    "id": "RO:0002630",
    "label": "directly negatively regulates",
    "relevant": false
  },
  {
    "id": "RO:0002632",
    "label": "ectoparasite of",
    "relevant": false
  },
  {
    "id": "RO:0002633",
    "label": "has ectoparasite",
    "relevant": false
  },
  {
    "id": "RO:0002634",
    "label": "endoparasite of",
    "relevant": false
  },
  {
    "id": "RO:0002635",
    "label": "has endoparasite",
    "relevant": false
  },
  {
    "id": "RO:0002636",
    "label": "mesoparasite of",
    "relevant": false
  },
  {
    "id": "RO:0002637",
    "label": "has mesoparasite",
    "relevant": false
  },
  {
    "id": "RO:0002638",
    "label": "intercellular endoparasite of",
    "relevant": false
  },
  {
    "id": "RO:0002639",
    "label": "has intercellular endoparasite",
    "relevant": false
  },
  {
    "id": "RO:0002640",
    "label": "intracellular endoparasite of",
    "relevant": false
  },
  {
    "id": "RO:0002641",
    "label": "has intracellular endoparasite",
    "relevant": false
  },
  {
    "id": "RO:0003000",
    "label": "produces",
    "relevant": false
  },
  {
    "id": "RO:0003001",
    "label": "produced_by",
    "relevant": false
  },
  {
    "id": "RO:0003002",
    "label": "represses expression of",
    "relevant": false
  },
  {
    "id": "RO:0003003",
    "label": "increases expression of",
    "relevant": false
  },
  {
    "id": "RO:0003301",
    "label": "has role in modeling",
    "relevant": false
  },
  {
    "id": "RO:0003302",
    "label": "causes or contributes to condition",
    "relevant": false
  },
  {
    "id": "RO:0003303",
    "label": "causes condition",
    "relevant": false
  },
  {
    "id": "RO:0003304",
    "label": "contributes to condition",
    "relevant": false
  },
  {
    "id": "RO:0003305",
    "label": "contributes to severity of condition",
    "relevant": false
  },
  {
    "id": "RO:0003306",
    "label": "contributes to frequency of condition",
    "relevant": false
  },
  {
    "id": "RO:0003307",
    "label": "ameliorates condition",
    "relevant": false
  },
  {
    "id": "RO:0003308",
    "label": "correlated with condition",
    "relevant": false
  },
  {
    "id": "RO:0003309",
    "label": "exacerbates condition",
    "relevant": false
  },
  {
    "id": "RO:0003310",
    "label": "condition ameliorated by",
    "relevant": false
  },
  {
    "id": "RO:0003311",
    "label": "condition exacerbated by",
    "relevant": false
  },
  {
    "id": "RO:0004000",
    "label": "condition has genetic basis in",
    "relevant": false
  },
  {
    "id": "RO:0004001",
    "label": "has material basis in gain of function germline mutation in",
    "relevant": false
  },
  {
    "id": "RO:0004002",
    "label": "has material basis in loss of function germline mutation in",
    "relevant": false
  },
  {
    "id": "RO:0004003",
    "label": "has material basis in germline mutation in",
    "relevant": false
  },
  {
    "id": "RO:0004004",
    "label": "has material basis in somatic mutation in",
    "relevant": false
  },
  {
    "id": "RO:0004005",
    "label": "has major susceptibility factor",
    "relevant": false
  },
  {
    "id": "RO:0004006",
    "label": "has partial material basis in germline mutation in",
    "relevant": false
  },
  {
    "id": "RO:0004007",
    "label": "has primary input or output",
    "relevant": false
  },
  {
    "id": "RO:0004008",
    "label": "has primary output",
    "relevant": false
  },
  {
    "id": "RO:0004009",
    "label": "has primary input",
    "relevant": false
  },
  {
    "id": "RO:0004010",
    "label": "is genetic basis for condition",
    "relevant": false
  },
  {
    "id": "RO:0004011",
    "label": "is causal gain of function germline mutation of in",
    "relevant": false
  },
  {
    "id": "RO:0004012",
    "label": "is causal loss of function germline mutation of in",
    "relevant": false
  },
  {
    "id": "RO:0004013",
    "label": "is causal germline mutation in",
    "relevant": false
  },
  {
    "id": "RO:0004014",
    "label": "is causal somatic mutation in",
    "relevant": false
  },
  {
    "id": "RO:0004015",
    "label": "is causal susceptibility factor for",
    "relevant": false
  },
  {
    "id": "RO:0004016",
    "label": "is causal germline mutation partially giving rise to",
    "relevant": false
  },
  {
    "id": "RO:0004017",
    "label": "realizable has basis in",
    "relevant": false
  },
  {
    "id": "RO:0004018",
    "label": "is basis for realizable",
    "relevant": false
  },
  {
    "id": "RO:0004019",
    "label": "disease has basis in",
    "relevant": false
  },
  {
    "id": "RO:0004020",
    "label": "disease has basis in dysfunction of",
    "relevant": false
  },
  {
    "id": "RO:0004021",
    "label": "disease has basis in disruption of",
    "relevant": false
  },
  {
    "id": "RO:0004022",
    "label": "disease has basis in feature",
    "relevant": false
  },
  {
    "id": "RO:0004023",
    "label": "causal relationship with disease as subject",
    "relevant": false
  },
  {
    "id": "RO:0004024",
    "label": "disease causes disruption of",
    "relevant": false
  },
  {
    "id": "RO:0004025",
    "label": "disease causes dysfunction of",
    "relevant": false
  },
  {
    "id": "RO:0004026",
    "label": "disease has location",
    "relevant": false
  },
  {
    "id": "RO:0004027",
    "label": "disease has inflammation site",
    "relevant": false
  },
  {
    "id": "RO:0004028",
    "label": "realized in response to stimulus",
    "relevant": false
  },
  {
    "id": "RO:0004029",
    "label": "disease has feature",
    "relevant": false
  },
  {
    "id": "RO:0004030",
    "label": "disease arises from structure",
    "relevant": false
  },
  {
    "id": "RO:0004031",
    "label": "enables subfunction",
    "relevant": false
  },
  {
    "id": "RO:0004032",
    "label": "acts upstream of or within, positive effect",
    "relevant": false
  },
  {
    "id": "RO:0004033",
    "label": "acts upstream of or within, negative effect",
    "relevant": false
  },
  {
    "id": "RO:0004034",
    "label": "acts upstream of, positive effect",
    "relevant": false
  },
  {
    "id": "RO:0004035",
    "label": "acts upstream of, negative effect",
    "relevant": false
  },
  {
    "id": "RO:0004046",
    "label": "causally upstream of or within, negative effect",
    "relevant": false
  },
  {
    "id": "RO:0004047",
    "label": "causally upstream of or within, positive effect",
    "relevant": false
  },
  {
    "id": "RO:0008501",
    "label": "epiphyte of",
    "relevant": false
  },
  {
    "id": "RO:0008502",
    "label": "has epiphyte",
    "relevant": false
  },
  {
    "id": "RO:0008503",
    "label": "kleptoparasite of",
    "relevant": false
  },
  {
    "id": "RO:0008504",
    "label": "kleptoparasitized by",
    "relevant": false
  },
  {
    "id": "RO:0008505",
    "label": "creates habitat for",
    "relevant": false
  },
  {
    "id": "RO:0008506",
    "label": "ecologically co-occurs with",
    "relevant": false
  },
  {
    "id": "RO:0008507",
    "label": "lays eggs on",
    "relevant": false
  },
  {
    "id": "RO:0008508",
    "label": "has eggs laid on by",
    "relevant": false
  },
  {
    "id": "RO:0009001",
    "label": "has substance added",
    "relevant": false
  },
  {
    "id": "RO:0009002",
    "label": "has substance removed",
    "relevant": false
  },
  {
    "id": "RO:0009003",
    "label": "immersed in",
    "relevant": false
  },
  {
    "id": "RO:0009004",
    "label": "has consumer",
    "relevant": false
  },
  {
    "id": "RO:0009005",
    "label": "has primary substance added",
    "relevant": false
  },
  {
    "id": "RO:0009501",
    "label": "realized in response to",
    "relevant": false
  },
  {
    "id": "RO:0010001",
    "label": "generically depends on",
    "relevant": false
  },
  {
    "id": "RO:0010002",
    "label": "is carrier of",
    "relevant": false
  },
  {
    "id": "RO:0011002",
    "label": "regulates activity of",
    "relevant": false
  },
  {
    "id": "RO:0011003",
    "label": "regulates quantity of",
    "relevant": false
  },
  {
    "id": "RO:0011004",
    "label": "indirectly regulates activity of",
    "relevant": false
  },
  {
    "id": "RO:0011007",
    "label": "decreases by repression quantity of",
    "relevant": false
  },
  {
    "id": "RO:0011008",
    "label": "increases by expression quantity of",
    "relevant": false
  },
  {
    "id": "RO:0011009",
    "label": "directly positively regulates quantity of",
    "relevant": false
  },
  {
    "id": "RO:0011010",
    "label": "directly negatively regulates quantity of",
    "relevant": false
  },
  {
    "id": "RO:0011013",
    "label": "indirectly positively regulates activity of",
    "relevant": false
  },
  {
    "id": "RO:0011014",
    "label": "destabilizes quantity of",
    "relevant": false
  },
  {
    "id": "RO:0011015",
    "label": "stabilizes quantity of",
    "relevant": false
  },
  {
    "id": "RO:0011016",
    "label": "indirectly negatively regulates activity of",
    "relevant": false
  },
  {
    "id": "RO:0011021",
    "label": "directly regulates quantity of",
    "relevant": false
  },
  {
    "id": "RO:0011022",
    "label": "indirectly regulates quantity of",
    "relevant": false
  },
  {
    "id": "RO:0011023",
    "label": "indirectly negatively regulates quantity of",
    "relevant": false
  },
  {
    "id": "RO:0011024",
    "label": "indirectly positively regulates quantity of",
    "relevant": false
  },
  {
    "id": "RO:0012000",
    "label": "has small molecule regulator",
    "relevant": false
  },
  {
    "id": "RO:0012001",
    "label": "has small molecule activator",
    "relevant": false
  },
  {
    "id": "RO:0012002",
    "label": "has small molecule inhibitor",
    "relevant": false
  },
  {
    "id": "RO:0012003",
    "label": "acts on population of",
    "relevant": false
  },
  {
    "id": "RO:0012004",
    "label": "is small molecule regulator",
    "relevant": false
  },
  {
    "id": "RO:0012005",
    "label": "is small molecule activator",
    "relevant": false
  },
  {
    "id": "RO:0012006",
    "label": "is small molecule inhibitor",
    "relevant": false
  },
  {
    "id": "RO:0013001",
    "label": "has synaptic IO in",
    "relevant": false
  },
  {
    "id": "RO:0013002",
    "label": "receives synaptic input in",
    "relevant": false
  },
  {
    "id": "RO:0013003",
    "label": "sends synaptic output to",
    "relevant": false
  },
  {
    "id": "RO:0013004",
    "label": "has synaptic IO throughout",
    "relevant": false
  },
  {
    "id": "RO:0013005",
    "label": "receives synaptic input throughout",
    "relevant": false
  },
  {
    "id": "RO:0013006",
    "label": "sends synaptic output throughout",
    "relevant": false
  },
  {
    "id": "RO:0040035",
    "label": "disease relationship",
    "relevant": false
  },
  {
    "id": "RO:0040036",
    "label": "has anatomical participant",
    "relevant": false
  },
  {
    "id": "RO:HOM0000000",
    "label": "in similarity relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000001",
    "label": "in homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000002",
    "label": "in homoplasy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000003",
    "label": "in homocracy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000004",
    "label": "in convergence relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000005",
    "label": "in parallelism relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000006",
    "label": "in structural homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000007",
    "label": "in historical homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000008",
    "label": "in biological homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000009",
    "label": "in reversal relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000010",
    "label": "in syntenic homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000011",
    "label": "in paralogy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000012",
    "label": "in syntenic paralogy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000013",
    "label": "in syntenic orthology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000014",
    "label": "in partial homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000015",
    "label": "in protein structural homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000016",
    "label": "in non functional homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000017",
    "label": "in orthology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000018",
    "label": "in xenology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000019",
    "label": "in 1 to 1 homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000020",
    "label": "in 1 to 1 orthology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000022",
    "label": "in ohnology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000023",
    "label": "in in-paralogy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000024",
    "label": "in out-paralogy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000025",
    "label": "in pro-orthology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000026",
    "label": "in semi-orthology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000027",
    "label": "in serial homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000028",
    "label": "in heterochronous homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000029",
    "label": "in paedomorphorsis relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000030",
    "label": "in peramorphosis relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000031",
    "label": "in progenesis relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000032",
    "label": "in neoteny relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000033",
    "label": "in mimicry relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000034",
    "label": "in 1 to many orthology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000036",
    "label": "in many to many homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000037",
    "label": "in 1 to many homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000042",
    "label": "in apomorphy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000043",
    "label": "in plesiomorphy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000044",
    "label": "in deep homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000045",
    "label": "in hemiplasy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000046",
    "label": "in gametology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000047",
    "label": "in chromosomal homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000048",
    "label": "in many to many orthology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000049",
    "label": "in within-species paralogy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000050",
    "label": "in between-species paralogy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000051",
    "label": "in postdisplacement relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000052",
    "label": "in hypermorphosis relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000053",
    "label": "in synology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000054",
    "label": "in isoorthology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000055",
    "label": "in tandem paralogy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000057",
    "label": "in latent homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000058",
    "label": "in syngeny relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000060",
    "label": "in apparent orthology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000061",
    "label": "in pseudoparalogy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000062",
    "label": "in equivalogy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000063",
    "label": "in interology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000065",
    "label": "in functional equivalence relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000066",
    "label": "in iterative homology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000068",
    "label": "in paraxenology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000069",
    "label": "in plerology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000071",
    "label": "in homotopy relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000072",
    "label": "in homeosis relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000073",
    "label": "in homoeology relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000074",
    "label": "in paramorphism relationship with",
    "relevant": false
  },
  {
    "id": "RO:HOM0000075",
    "label": "in regulogy relationship with",
    "relevant": false
  },
  {
    "id": "obo:SEPIO_0000124",
    "label": "has supporting reference",
    "relevant": false
  },
  {
    "id": "obo:UBPROP_0000004",
    "label": "obsolete provenance_notes",
    "relevant": false
  },
  {
    "id": "obo:UBREL_0000002",
    "relevant": false
  },
  {
    "id": "obo:caro#develops_from",
    "relevant": false
  },
  {
    "id": "obo:caro#part_of",
    "relevant": false
  },
  {
    "id": "obo:cl#has_completed",
    "label": "has_completed",
    "relevant": false
  },
  {
    "id": "obo:cl#has_high_plasma_membrane_amount",
    "label": "has_high_plasma_membrane_amount",
    "relevant": false
  },
  {
    "id": "obo:cl#has_low_plasma_membrane_amount",
    "label": "has_low_plasma_membrane_amount",
    "relevant": false
  },
  {
    "id": "obo:cl#has_not_completed",
    "label": "has_not_completed",
    "relevant": false
  },
  {
    "id": "obo:cl#lacks_part",
    "label": "lacks_part",
    "relevant": false
  },
  {
    "id": "obo:cl#lacks_plasma_membrane_part",
    "label": "lacks_plasma_membrane_part",
    "relevant": false
  },
  {
    "id": "obo:core#connected_to",
    "relevant": false
  },
  {
    "id": "obo:core#distally_connected_to",
    "relevant": false
  },
  {
    "id": "obo:core#innervated_by",
    "relevant": false
  },
  {
    "id": "obo:core#subdivision_of",
    "relevant": false
  },
  {
    "id": "obo:ddanat#develops_from",
    "label": "develops_from",
    "relevant": false
  },
  {
    "id": "obo:ddanat#part_of",
    "label": "part of",
    "relevant": false
  },
  {
    "id": "obo:emapa#attached_to",
    "label": "attached_to",
    "relevant": false
  },
  {
    "id": "obo:emapa#develops_from",
    "label": "develops_from",
    "relevant": false
  },
  {
    "id": "obo:emapa#develops_in",
    "label": "develops_in",
    "relevant": false
  },
  {
    "id": "obo:emapa#ends_at",
    "label": "ends_at",
    "relevant": false
  },
  {
    "id": "obo:emapa#has_part",
    "label": "has_part",
    "relevant": false
  },
  {
    "id": "obo:emapa#is_a",
    "label": "is_a",
    "relevant": false
  },
  {
    "id": "obo:emapa#located_in",
    "label": "located_in",
    "relevant": false
  },
  {
    "id": "obo:emapa#part_of",
    "label": "part_of",
    "relevant": false
  },
  {
    "id": "obo:emapa#starts_at",
    "label": "starts_at",
    "relevant": false
  },
  {
    "id": "obo:go/extensions/ro_pending#alters_location_of",
    "label": "obsolete alters location of",
    "relevant": false
  },
  {
    "id": "obo:go/extensions/ro_pending#results_in_connection_of",
    "label": "obsolete results_in_connection_of",
    "relevant": false
  },
  {
    "id": "obo:go/extensions/ro_pending#results_in_transport_through",
    "label": "obsolete results_in_transport_through",
    "relevant": false
  },
  {
    "id": "obo:pato#has_cross_section",
    "label": "has_cross_section",
    "relevant": false
  },
  {
    "id": "obo:pr#lacks_part",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#anastomoses_with",
    "label": "anastomoses with",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#anteriorly_connected_to",
    "label": "anteriorly connected to",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#channel_for",
    "label": "channel for",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#channels_from",
    "label": "channels_from",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#channels_into",
    "label": "channels_into",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#conduit_for",
    "label": "conduit for",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#developmentally_succeeded_by",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#distally_connected_to",
    "label": "distally connected to",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#extends_fibers_into",
    "label": "extends_fibers_into",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#filtered_through",
    "label": "filtered through",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#has_start",
    "label": "has_start",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#in_central_side_of",
    "label": "in_central_side_of",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#in_innermost_side_of",
    "label": "in_innermost_side_of",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#in_outermost_side_of",
    "label": "in_outermost_side_of",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#indirectly_supplies",
    "label": "indirectly_supplies",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#layer_part_of",
    "label": "layer part of",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#posteriorly_connected_to",
    "label": "posteriorly connected to",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#protects",
    "label": "protects",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#proximally_connected_to",
    "label": "proximally connected to",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#sexually_homologous_to",
    "label": "sexually_homologous_to",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#site_of",
    "label": "site_of",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#subdivision_of",
    "label": "subdivision of",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#synapsed_by",
    "label": "synapsed by",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#transitively_anteriorly_connected_to",
    "label": "transitively anteriorly connected to",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#transitively_connected_to",
    "label": "transitively_connected to",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#transitively_distally_connected_to",
    "label": "transitively distally connected to",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#transitively_proximally_connected_to",
    "label": "transitively proximally connected to",
    "relevant": false
  },
  {
    "id": "obo:uberon/core#trunk_part_of",
    "label": "trunk_part_of",
    "relevant": false
  },
  {
    "id": "obo:wbbt#develops_from",
    "relevant": false
  },
  {
    "id": "obo:wbbt#part_of",
    "relevant": false
  },
  {
    "id": "obo:wbbt#xunion_of",
    "label": "exclusive_union_of",
    "relevant": false
  },
  {
    "id": "obo:wbphenotype/wbphenotype-equivalent-axioms-subq#during",
    "relevant": false
  },
  {
    "id": "obo:wbphenotype/wbphenotype-equivalent-axioms-subq#ends_during_or_before",
    "relevant": false
  },
  {
    "id": "obo:wbphenotype/wbphenotype-equivalent-axioms-subq#has_quality",
    "relevant": false
  },
  {
    "id": "obo:wbphenotype/wbphenotype-equivalent-axioms-subq#in_response_to",
    "relevant": false
  },
  {
    "id": "obo:wbphenotype/wbphenotype-equivalent-axioms-subq#starts_during_or_after",
    "relevant": false
  },
  {
    "id": "obo:xao#end_stage",
    "label": "ends during",
    "relevant": false
  },
  {
    "id": "obo:xao#preceded_by",
    "label": "preceded by",
    "relevant": false
  },
  {
    "id": "obo:xao#start_stage",
    "label": "starts during",
    "relevant": false
  },
  {
    "id": "http://semanticscience.org/resource/SIO_000658",
    "label": "immediate_transformation_of",
    "relevant": false
  }
]