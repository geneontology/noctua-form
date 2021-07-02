---
title: Noctua Form 2.0
---

# Noctua Form 2

Welcome to the second release of Noctua Form. From the user’s feedback from
Noctua Form 1.0, this version was a complete rewrite to utilize the modern UI
features and web technologies. We added a clever layout design such that it is
seamless to switch between components like easy form, advanced forms, display,
editing, causal relation editor etc. This version has the same feel as the
previous, but packed with improved features. The main focus was to solidify the
product and incorporate as much user feedback as possible while introducing new
features. We hope you enjoy some of the features and the transitioning from
Noctua 1.0 to 2.0 will be easy. Some of the key highlights include

## Highlights

### Added

- The Causal Relations Form
- Graphical preview available to check annotations before saving
- Systematic ordering of table of annotations
- Biological Process Annotations no mapping
- Cellular Component Annotations extension
- Link outs to more info for each autocomplete entities
- Background color to popup boxes (reference box, autocomplete box) to easily
    distinguish from background form
- Collapse All/ Expand All activities

### Changed

- Can create dynamic annotation extensions in addition to creating standard
    annotations
- Thin Form Input: Annotation extension fields added, as needed
- Multiline Form input to avoid cutting clamping data
- Multiline Autocomplete to avoid cutting clamping data
- Improved Search Database display
- Categorised Side Menu on the form
- Editable Curator friendly table view for displaying annotations
- A basic table view for displaying standard annotations

### Removed

- Creating Macromolecular complex on the fly
- Link to an existing node

## Creating Annotations

The form can now create standard annotation with extensions

### Extension Relations

- MF happens during Biological Phase
- MF has input GP
- MF has output GP
- BP part of BP part of BP
- CC occurs in Cell Type part of Uberon part of Organism

### Streamlined Form interface

- Contextual information (annotation extension) fields added, as needed
- Autocompletes link out to external entity or term information pages
- Easily switch from between 3 different forms
- Graphical preview available to check annotations before saving
  
BP Only Form
------------

Easily shows the relation between the GP, RootMF and the BP term.

No need to map corresponding GO-CAM relation

BP only form does not allow ‘Save’ unless curator enters a BP

Search Database
---------------

- Improved display with 2 panes
- Easily show list terms (left pane) and selected evidences (right pane

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

## Display Existing Annotations

New annotations are added to an annotation table sorted alphabetically by
gene/gene product name

Field-specific editing in the table view