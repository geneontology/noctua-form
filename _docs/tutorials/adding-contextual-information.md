---
---
### **Adding contextual information to a basic Activity Unit**

- Click on ‘Create Activity’
- Using C. elegans as an example:
    - Type in gene name: **mpk-1** (explain that returned entities are what is
        in gpi file and therefore in NEO)
    - Autocomplete options are presented in a pop-up window
    - Gene products link out to respective gene product pages via dbxrefs.yaml

- Add an MF
    - Search for ‘**protein kinase activity**’
    - Autocomplete options are presented in a pop-up window
    - Terms link out to AmiGO
    - Evidence code autocomplete using ECO term names
        - Search for ‘**direct assay**’
        - GO codes are indicated with bold three-letter GO code

    - Add a reference. Two options:
        - Cut and paste a DB and id, e.g. **PMID:31296532 OR**
        - Click on the +/lines symbol
            - Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF
            - Select **PMID**
            - Add identifier: **31296532**

- Add an input to the MF
    - Click on the ‘more options’ icon on the far right of the annotation line
    - Scroll down to the Add option
    - Select Add ‘**has input**’ (GP/Chemical)
    - A new line for the ‘has input’ entity and evidence will appear
    - Type in ‘**ced-3**’ and select the gene from the autocomplete menu
    - Evidence code autocomplete using ECO term names
        - Search for ‘**direct assay**’
        - GO codes are indicated with bold three-letter GO code

    - Add a reference. Two options:
        - Cut and paste a DB and id, e.g. **PMID:31296532 OR**
        - Click on the +/lines symbol
            - Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF
            - Select **PMID**
            - Add identifier: **31296532**
    - Repeat steps i - vii to add ‘has output’ and/or ‘happens during’
        contextual information, as needed.

- Add that MF is ‘part of’ a BP
    - Search for ‘**DNA damage response, detection of DNA damage**’
    - Autocomplete options are presented in a pop-up window
    - Terms link out to AmiGO

    - Evidence code autocomplete using ECO term names
        - Search for ‘**mutant phenotype**’
        - GO codes are indicated with bold three-letter GO code

    - Add a reference. Two options:

        - Cut and paste a DB and id, e.g. **PMID:31296532 OR**
        - Click on the +/lines symbol

            - Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF
            - Select **PMID**
            - Add identifier: **31296532**

- Add that the first BP is ‘part of’ a second BP

    - Click on the ‘more options’ icon on the far right of the annotation line
    - Scroll down to the Add option
    - Select Add ‘**part of**’ (Biological Process)
    - A new line for the ‘part of’ BP and evidence will appear
    - Type in ‘**apoptotic process**’ and select the GO term from the
        autocomplete menu

    - Evidence code autocomplete using ECO term names

        - Search for ‘**mutant phenotype**’
        - GO codes are indicated with bold three-letter GO code

    - Add a reference. Two options:

        - Cut and paste a DB and id, e.g. **PMID:31296532 OR**
        - Click on the +/lines symbol

            - Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF
            - Select **PMID**
            - Add identifier: **31296532**

    - Repeat steps i - vii to add more ‘part of’ BPs, as needed.

- Add that MF ‘occurs in’ a CC

    - Search for ‘**nucleus**’
    - Autocomplete options are presented in a pop-up window
    - Terms link out to AmiGO

    - Evidence code autocomplete using ECO term names
        - Search for ‘**direct assay**’
        - GO codes are indicated with bold three-letter GO code
    - Add a reference. Two options:
        - Cut and paste a DB and id, e.g. **PMID:31296532 OR**
        - Click on the +/lines symbol
            - Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF
            - Select **PMID**
            - Add identifier: **31296532**

- Add that a CC is ‘part of’ a cell
    - Click on the ‘more options’ icon on the far right of the annotation line
    - Scroll down to the Add option
    - Select Add ‘**part of**’ (Cell Type)
    - A new line for the ‘part of’ cell type and evidence will appear
    - Type in ‘**germ cell**’ and select the WBbt:0006796 from the
        autocomplete menu

    - Evidence code autocomplete using ECO term names
        - Search for ‘**direct assay**’
        - GO codes are indicated with bold three-letter GO code

    - Add a reference. Two options:
        - Cut and paste a DB and id, e.g. **PMID:31296532 OR**
        - Click on the +/lines symbol
            - Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF
            - Select **PMID**
            - Add identifier: **31296532**

    - Repeat steps i - vii to add ‘part of’ for tissue and organism contextual
        information, as needed. Note that organismal contextual information is
        not needed except for when relevant to multi-species processes.

