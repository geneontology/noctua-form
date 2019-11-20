---
---

# **Creating a Cellular Component (CC) only annotation**

- Click on the arrow to the left of the ‘Create Activity’ icon.
- Select ‘Create New CC Annotation’.
- Using C. elegans as an example:
    - Type in gene name: **skn-1**
    - Select the WBGene entry from the dropdown list
    - Gene products link out to respective gene product pages via dbxrefs.yaml

- Note that the CC only form creates annotations stating only that a gene
    product is ‘located in’ a given GO CC and is not making any claims about
    where the MF of that gene product may occur.

- Add the CC
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

- Adding contextual information to a CC only annotation can be done as for
    [Activity Units](#_kjrzn3qe1kp6).
