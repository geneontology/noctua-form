---
title: Noctua Form 0.1
---
  
# Noctua Form 0.1

Welcome to the release of Simple Annoton Editor. This is a limited version and
we hope you enjoy some of the features. Some of the key highlights include

Highlights
----------

### Added

- A basic form to create standard annotations
- GP input autocompletable
- GO Terms input auto completable
- Evidence input autocompletable
- Constrained and limited relations
- A basic table view for displaying standard annotations
  
Creating Annotations
--------------------

A form contains limited and constrained relations for creating standard
annotations without extensions

**Limited relations**

- MF enabled_by GP
- MF occurs_in CC
- MF part of BP

GP, GO Term and evidence inputs are all autocompletable. .After typing on the
input box, autocomplete options are presented in a dropdown window

Display Existing Annotations
----------------------------

A basic tree table view which can display standard annotations in an indented
sentence like format.

- GP is enabled by MF, with evidence (reference)
    - occurs_in of BP with evidence (reference)
    - part_of BP with evidence (reference)


