Noctua Form 2.0
===============

Welcome to the second release of Noctua Form. From the user’s feedback from
Noctua Form 1.0, this version was a complete rewrite to utilize the modern UI
features and web technologies. We added a clever layout design such that it is
seamless to switch between components like easy form, advanced forms, display,
editing, causal relation editor etc. This version has the same feel as the
previous, but packed with improved features. The main focus was to solidify the
product and incorporate as much user feedback as possible while introducing new
features. We hope you enjoy some of the features and the transitioning from
Noctua 1.0 to 2.0 will be easy. Some of the key highlights include

Highlights
----------

### Added

-   The Causal Relations Form

-   Graphical preview available to check annotations before saving

-   Systematic ordering of table of annotations

-   Biological Process Annotations no mapping

-   Cellular Component Annotations extension

-   Link outs to more info for each autocomplete entities

-   Background color to popup boxes (reference box, autocomplete box) to easily
    distinguish from background form

-   Collapse All/ Expand All activities

### Changed

-   Can create dynamic annotation extensions in addition to creating standard
    annotations

-   Thin Form Input: Annotation extension fields added, as needed

-   Multiline Form input to avoid cutting clamping data

-   Multiline Autocomplete to avoid cutting clamping data

-   Improved Search Database display

-   Categorised Side Menu on the form

-   Editable Curator friendly table view for displaying annotations

-   A basic table view for displaying standard annotations

### Removed

-   Creating Macromolecular complex on the fly

-   Link to an existing node

Creating Annotations
--------------------

The form can now create standard annotation with extensions

### Extension Relations

-   MF happens during Biological Phase

-   MF has input GP

-   MF has output GP

-   BP part of BP part of BP

-   CC occurs in Cell Type part of Uberon part of Organism

### Streamlined Form interface

-   Contextual information (annotation extension) fields added, as needed

-   Autocompletes link out to external entity or term information pages

-   Easily switch from between 3 different forms

-   Graphical preview available to check annotations before saving

BP Only Form
------------

Easily shows the relation between the GP, RootMF and the BP term.

No need to map corresponding GO-CAM relation

BP only form does not allow ‘Save’ unless curator enters a BP

Search Database
---------------

-   Improved display with 2 panes

-   Easily show list terms (left pane) and selected evidences (right pane

Evidence
--------

To help curators select the correct GO evidence code, three-letter GO code is
also provide in the autocomplete list.

GO codes are indicated with bold three-letter GO code

Pop-up appears with a select drop-down of dbs for references: PMID, DOI, GO_REF

Causal Relation Editor Form
---------------------------

The Causal Relations Form helps guide curators through selecting the appropriate
causal relation

Guidance for selecting relations between activities (Causal Relation Form)

Display Existing Annotations
----------------------------

New annotations are added to an annotation table sorted alphabetically by
gene/gene product name

Field-specific editing in the table view

Noctua Form 1.0
===============

Welcome to the first release of Noctua Form formerly known as the Simple Annoton
Editor. The focus of this version was working closely with curators to get
initial release, layout and overall feel of Noctua Form. This version is packed
with awesome features, mainly on different concepts of data input form structure
and displaying existing annotations. We hope you enjoy some of the features.
Some of the key highlights include

Highlights
----------

### Added

-   Can create annotation extensions in addition to creating standard
    annotations

-   Introducing Biological Process Annotations

-   Introducing Cellular Component Annotations

-   Can add a NOT qualifier to root MF, CC or BP

-   Extension input autocompletable,

-   More constrained and limited relations to the standard annotations with
    extensions

-   Multiple pieces of evidence

-   Can create Macromolecular complex on the fly

-   Search Database - Use existing annotations

-   Side menu on each form entity row for more options

-   Link to existing node

-   Error Messages

-   Clone Evidence

-   Easily switch user groups while creating annotations and populating assigned
    by evidence annotation

-   Links to other workbenches from the Noctua Form

### Changed

-   Tree view like form. Extensions inputs indented

-   Curator friendly table view for displaying annotations

-   Constrained and limited relations

### Removed

-   A basic table display,

-   Inline form view labels

Creating Annotations
--------------------

The form can now create standard annotation with extensions

Extension Relations
-------------------

-   MF happens during Biological Phase

-   MF has input GP

-   BP part of BP part BP

-   CC occurs in Cell Type part of Uberon

Easily switch from between 3 different forms

BP Only Form
------------

BP Only form is used for biological process annotations

Relations

-   MF (root_mf) enabled by GP

-   MF (root_mf) causal \* of \* BP occurs in Cell Type part of Anatomical
    Entity

Easily shows the relation between the GP and the BP term by using acts \*

All causal relations (except Default ‘involved in’) are available in BP only
form and map correctly to the corresponding GO-CAM relation

CC Only Form
------------

CC Only Form is used for cellular component annotations

Relations

-   GP part of CC part of Cell Type part of Anatomical

Macromolecular Complex Creator
------------------------------

Can create macromolecular complex on the fly

-   MF enabled by Macromolecular Complex has part GP(n)

Easily switch between GP and Macromolecular Complex

Search Database
---------------

Search existing annotations by a given GP and aspect

Evidence
--------

Multiple pieces of evidence

Displaying Existing Annotations
-------------------------------

Added the curator table friendly view

Columns added are

-   Annotated Entity

-   Aspect

-   Term

-   Relationship

-   Extension Term

-   Extension Relationship

-   Evidence

-   Reference

-   With

-   Assigned By

Noctua Form 0.1
===============

Welcome to the release of Simple Annoton Editor. This is a limited version and
we hope you enjoy some of the features. Some of the key highlights include

Highlights
----------

### Added

-   A basic form to create standard annotations

-   GP input autocompletable

-   GO Terms input auto completable

-   Evidence input autocompletable

-   Constrained and limited relations

-   A basic table view for displaying standard annotations

Creating Annotations
--------------------

A form contains limited and constrained relations for creating standard
annotations without extensions

**Limited relations**

-   MF enabled_by GP

-   MF occurs_in CC

-   MF part of BP

GP, GO Term and evidence inputs are all autocompletable. .After typing on the
input box, autocomplete options are presented in a dropdown window

Display Existing Annotations
----------------------------

A basic tree table view which can display standard annotations in an indented
sentence like format.

-   GP is enabled by MF, with evidence (reference)

    -   occurs_in of BP with evidence (reference)

    -   part_of BP with evidence (reference)

Component History
=================

Term Autocomplete 
------------------

| Version         | Details                                                                                                                                        |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Noctua Form 0.1 | Introduced as [id and label] in one line. A user would type at least 3 characters search and a dropdown would appear with 10 matching terms    |
| Noctua Form 1.0 | Added a multiline to avoid clamping and cutting of terms (Karen) Added linkouts to more info for each autocomplete entities (Pascal, Kimberly) |

**Contributors**: Karen, Kimberly, Pascal

Nested Table Viewer
-------------------

| Version         | Details                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| Noctua Form 0.1 | Displayed simple annotations (no extensions) in a nested format                                                 |
| Noctua Form 1.0 | Discontinued in favor of a much more friendly curator view as reading extension would overwhelm the basic table |

**Contributors**:

Curator Friendly Viewer
-----------------------

| Version         | Details                                                            |
| --------------- | ------------------------------------------------------------------ |
| Noctua Form 1.0 | Replaced the nested view                                           |
| Noctua Form 2.0 | Activities are clearly sectioned and can be collapsed and expanded |

-   Inclusion of qualifiers and extensions in this tabular view (Karen)

-   Show everything without needing to click or scroll side to side

-   Wrapping text rather than truncating (Karen)

-   Clearly distinguish activities by shading or line separators (Karen)

-   Highlighting errors and warning on row

-   Removed Annotated entity as a column to the heading of an activity

-   Inline editing

**Contributors**: Karen, Kimberly, Pascal

Term Side Menu […]
------------------

**Contributors**: Kimberly, Pascal

Causal Relations Form
---------------------

**Contributors**: Paul, Kimberly, Pascal
