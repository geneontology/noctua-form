Add a search API to Minerva - drive front page and [Annotation Review Tool](http://noctua-dev.berkeleybop.org/workbench/noctua-annotation-review/)  which might be the same thing.  

## Endpoint

**api/search**

- Default sorting is date DESC recent models
- Default n models per page
- All the parameters are optional and by default it should bring recent n models with 'Date DESC'

## Parameters

| Parameter                          | Format             | Comments                                                                                           |
| ---------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------- |
| **gps** (optional)                 | list\<gp>          | A list of one or more gps in a model (AND operator)                                                |
| **goterms**  (optional)            | list\<goterm>      | A list of one or more GO terms in a model (AND operator)                                           |
| **pmids** (optional)               | list\<pmid>        | A list of one or more pmids in a model (AND operator)                                              |
| **taxa** (optional)                | list\<taxon>       | A list of one or more taxon                                                                        |
| Model Meta                         |
| **title** (optional)               | string             | Partial String (contains) so it works like the current landing page                                |
| **states** (optional)              | list\<state>       | A list of one or more model states 'development, production, closed, review, delete' (OR operator) |
| **contributors** (optional)        | list\<contributor> | A list of one or more contributors in a model (AND operator)                                       |
| **groups** (optional)              | list\<group>       | A list of one or more groups(provided by) in a model (AND operator)                                |
| **date** (optional)                | date               | model date)                                                                                        |
| Pagination (optional, none or all) |
| **page**                           | int                | Page number                                                                                        |
| **offset**                         | int                | Page Offset                                                                                        |
| **limit**                          | int                | Page Size                                                                                          |


## Return

**total count matched models** for progressive pagination when one needs second page 

A list of

| Parameter              | Format             | Comments                                              |
| ---------------------- | ------------------ | ----------------------------------------------------- |
| **model id**           | iri                | A model id                                            |
| **matched nodes**      | list\<iri>         | A list of one or more matched individual nodes        |
| Model Meta             |
| **model title**        | string             | A model title, first title annotation is fine if many |
| **model state**        | string             | A model's state                                       |
| **model date**         | string             | A model modified date                                 |
| **model contributors** | List\<contributor> | A list of model's contributors                        |
| **model groups**       | List\<groups>      | A list of model's groups (provided by)                |


**Implementation**: 
a sparql query composer
response object model

**Web Access**- This is either accessed by a new Jersey service (e.g. /search like [this sparql endpoint](https://github.com/geneontology/minerva/blob/master/minerva-server/src/main/java/org/geneontology/minerva/server/handler/SPARQLHandler.java)) or a new  handler for current route /M3Batch (using the main existing protocol)