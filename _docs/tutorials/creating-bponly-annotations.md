---
---

### **Creating a Biological Process (BP) only annotation**

- Click on the arrow to the left of the ‘Create Activity’ icon.
- Select ‘Create New BP Annotation’.
- Using C. elegans as an example:
  - Type in gene name: **skn-1**
  - Select the WBGene entry from the dropdown list
  - Gene products link out to respective gene product pages via dbxrefs.yaml
- Note that the BP only form automatically fills in the root Molecular
    Function GO term (GO:0003674). This is done because the GO-CAM data model
    requires an MF annotation in order to associate a gene with a BP.
- Select the appropriate relation between the root MF term and the GO BP term
    based on the experimental evidence you have in the paper. For example, a
    mutant phenotype may simply warrant ‘causally upstream of or within’.

- Add the BP
  - Search for ‘**innate immune response**’
  - Autocomplete options are presented in a pop-up window
  - Terms link out to AmiGO
  - Enter the appropriate evidence code from using ECO term names
  - Search for ‘**mutant phenotype**’
  - GO codes are indicated with bold three-letter GO code
  - Add a reference. Two options:
    - Cut and paste a DB and id, e.g. **PMID:30442878 OR**
    - Click on the +/lines symbol

- Add the CC
  - If applicable, add that the BP ‘occurs in’ a GO CC. Note that this is
      different from saying that the MF ‘occurs in’ a GO CC, which is the
      statement made in an Activity Unit.
  - Search for ‘**nucleus**’
  - Autocomplete options are presented in a pop-up window
  - Terms link out to AmiGO
  - Evidence code autocomplete using ECO term names
  - Search for ‘**direct assay**’
  - GO codes are indicated with bold three-letter GO code
  - Add a reference. Two options:
        - Cut and paste a DB and id, e.g. **PMID:30442878 OR**
        - Click on the +/lines symbol
            - Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF
            - Select **PMID**
            - Add identifier: **30442878**

- Adding contextual information to a BP only annotation can be done as for
    [Activity Units](#_kjrzn3qe1kp6) but note that contextual information cannot
    be added to the root MF term.
