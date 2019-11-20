---
title: Noctua Form 1.0
---

# Noctua Form 1.0

Welcome to the first release of Noctua Form formerly known as the Simple Annoton
Editor. The focus of this version was working closely with curators to get
initial release, layout and overall feel of Noctua Form. This version is packed
with awesome features, mainly on different concepts of data input form structure
and displaying existing annotations. We hope you enjoy some of the features.
Some of the key highlights include

Highlights
----------

### Added

- Can create annotation extensions in addition to creating standard
    annotations
- Introducing Biological Process Annotations
- Introducing Cellular Component Annotations
- Can add a NOT qualifier to root MF, CC or BP
- Extension input autocompletable,
- More constrained and limited relations to the standard annotations with
    extensions
- Multiple pieces of evidence
- Can create Macromolecular complex on the fly
- Search Database - Use existing annotations
- Side menu on each form entity row for more options
- Link to existing node
- Error Messages
- Clone Evidence
- Easily switch user groups while creating annotations and populating assigned
    by evidence annotation
- Links to other workbenches from the Noctua Form

### Changed

- Tree view like form. Extensions inputs indented
- Curator friendly table view for displaying annotations
- Constrained and limited relations

### Removed

- A basic table display,
- Inline form view labels

Creating Annotations
--------------------

The form can now create standard annotation with extensions

Extension Relations
-------------------

- MF happens during Biological Phase
- MF has input GP
- BP part of BP part BP
- CC occurs in Cell Type part of Uberon


Easily switch from between 3 different forms

BP Only Form
------------

BP Only form is used for biological process annotations

Relations

- MF (root_mf) enabled by GP
- MF (root_mf) causal \* of \* BP occurs in Cell Type part of Anatomical
    Entity

Easily shows the relation between the GP and the BP term by using acts \*

All causal relations (except Default ‘involved in’) are available in BP only
form and map correctly to the corresponding GO-CAM relation

CC Only Form
------------

CC Only Form is used for cellular component annotations

Relations

- GP part of CC part of Cell Type part of Anatomical

Macromolecular Complex Creator
------------------------------

Can create macromolecular complex on the fly

- MF enabled by Macromolecular Complex has part GP(n)

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

- Annotated Entity
- Aspect
- Term
- Relationship
- Extension Term
- Extension Relationship
- Evidence
- Reference
- With
- Assigned By