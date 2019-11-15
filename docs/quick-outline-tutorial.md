Noctua Form 2.0 - Quick Start Tutorial
======================================


ACCESSING THE NOCTUA CURATION FORM
----------------------------------

For workshop purposes, we’ll use noctua-dev:

<http://noctua-dev.berkeleybop.org/>

For reporting any issues: <https://github.com/geneontology/noctua-form/issues>

LOGIN
-----

Before beginning new annotation or work on an existing model, you need to login.

Noctua login uses a curator’s github handle for authentication.

CREATING GO ANNOTATIONS IN NOCTUA
---------------------------------

### **Creating a basic Activity Unit (MF, part of BP, occurs in CC)**

1.  Click on ‘Create Activity’

2.  Using C. elegans as an example:

    1.  Type in gene name: **mpk-1** (explain that returned entities are what is
        in gpi file and therefore in NEO)

    2.  Autocomplete options are presented in a pop-up window

    3.  Gene products link out to respective gene product pages via dbxrefs.yaml

![](media/d2fb24f0c880e32cd7caf825b34ca622.gif)

1.  Add an MF

    1.  Search for ‘**protein kinase activity**’

    2.  Autocomplete options are presented in a pop-up window

    3.  Terms link out to AmiGO

![](media/5be22adb52989ef372d565b8b7e25f8a.gif)

1.  Evidence code autocomplete using ECO term names

    1.  Search for ‘**direct assay**’

    2.  GO codes are indicated with bold three-letter GO code

![](media/72fec3c4159cb987c342003c3537c848.gif)

1.  Add a reference. Two options:

    1.  Cut and paste a DB and id, e.g. **PMID:31296532 OR**

    2.  Click on the +/lines symbol

        1.  Pop-up appears with a select drop-down of dbs for references: PMID,
            DOI, GO_REF

        2.  Select **PMID**

        3.  Add identifier: **31296532**

![](media/19434031dea1d37b216adc354a9baf84.gif)

>   (Note that at this point you can save just your MF annotation by clicking on
>   the SAVE button. This will save the MF annotation and automatically save the
>   resulting model. However, if you want to add contextual information, such as
>   MF inputs, or a Biological Process or Cellular Component annotation, you
>   should wait until you’ve added all information before saving.)

1.  Add that MF is ‘part of’ a BP

    1.  Search for ‘**DNA damage response, detection of DNA damage**’

    2.  Autocomplete options are presented in a pop-up window

    3.  Terms link out to AmiGO

    4.  Evidence code autocomplete using ECO term names

        1.  Search for ‘**mutant phenotype**’

        2.  GO codes are indicated with bold three-letter GO code

    5.  Add a reference. Two options:

        1.  Cut and paste a DB and id, e.g. **PMID:31296532 OR**

        2.  Click on the +/lines symbol

            1.  Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF

            2.  Select **PMID**

            3.  Add identifier: **31296532**

2.  Add that MF ‘occurs in’ a CC

    1.  Search for ‘**nucleus**’

    2.  Autocomplete options are presented in a pop-up window

    3.  Terms link out to AmiGO

    4.  Evidence code autocomplete using ECO term names

        1.  Search for ‘**direct assay**’

        2.  GO codes are indicated with bold three-letter GO code

    5.  Add a reference. Two options:

        1.  Cut and paste a DB and id, e.g. **PMID:31296532 OR**

        2.  Click on the +/lines symbol

            1.  Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF

            2.  Select **PMID**

            3.  Add identifier: **31296532**

### **Adding contextual information to a basic Activity Unit**

1.  Click on ‘Create Activity’

2.  Using C. elegans as an example:

    1.  Type in gene name: **mpk-1** (explain that returned entities are what is
        in gpi file and therefore in NEO)

    2.  Autocomplete options are presented in a pop-up window

    3.  Gene products link out to respective gene product pages via dbxrefs.yaml

3.  Add an MF

    1.  Search for ‘**protein kinase activity**’

    2.  Autocomplete options are presented in a pop-up window

    3.  Terms link out to AmiGO

    4.  Evidence code autocomplete using ECO term names

        1.  Search for ‘**direct assay**’

        2.  GO codes are indicated with bold three-letter GO code

    5.  Add a reference. Two options:

        1.  Cut and paste a DB and id, e.g. **PMID:31296532 OR**

        2.  Click on the +/lines symbol

            1.  Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF

            2.  Select **PMID**

            3.  Add identifier: **31296532**

4.  Add an input to the MF

    1.  Click on the ‘more options’ icon on the far right of the annotation line

    2.  Scroll down to the Add option

    3.  Select Add ‘**has input**’ (GP/Chemical)

    4.  A new line for the ‘has input’ entity and evidence will appear

    5.  Type in ‘**ced-3**’ and select the gene from the autocomplete menu

    6.  Evidence code autocomplete using ECO term names

        1.  Search for ‘**direct assay**’

        2.  GO codes are indicated with bold three-letter GO code

    7.  Add a reference. Two options:

        1.  Cut and paste a DB and id, e.g. **PMID:31296532 OR**

        2.  Click on the +/lines symbol

            1.  Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF

            2.  Select **PMID**

            3.  Add identifier: **31296532**

    8.  Repeat steps i - vii to add ‘has output’ and/or ‘happens during’
        contextual information, as needed.

5.  Add that MF is ‘part of’ a BP

    1.  Search for ‘**DNA damage response, detection of DNA damage**’

    2.  Autocomplete options are presented in a pop-up window

    3.  Terms link out to AmiGO

    4.  Evidence code autocomplete using ECO term names

        1.  Search for ‘**mutant phenotype**’

        2.  GO codes are indicated with bold three-letter GO code

    5.  Add a reference. Two options:

        1.  Cut and paste a DB and id, e.g. **PMID:31296532 OR**

        2.  Click on the +/lines symbol

            1.  Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF

            2.  Select **PMID**

            3.  Add identifier: **31296532**

6.  Add that the first BP is ‘part of’ a second BP

    1.  Click on the ‘more options’ icon on the far right of the annotation line

    2.  Scroll down to the Add option

    3.  Select Add ‘**part of**’ (Biological Process)

    4.  A new line for the ‘part of’ BP and evidence will appear

    5.  Type in ‘**apoptotic process**’ and select the GO term from the
        autocomplete menu

    6.  Evidence code autocomplete using ECO term names

        1.  Search for ‘**mutant phenotype**’

        2.  GO codes are indicated with bold three-letter GO code

    7.  Add a reference. Two options:

        1.  Cut and paste a DB and id, e.g. **PMID:31296532 OR**

        2.  Click on the +/lines symbol

            1.  Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF

            2.  Select **PMID**

            3.  Add identifier: **31296532**

    8.  Repeat steps i - vii to add more ‘part of’ BPs, as needed.

7.  Add that MF ‘occurs in’ a CC

    1.  Search for ‘**nucleus**’

    2.  Autocomplete options are presented in a pop-up window

    3.  Terms link out to AmiGO

    4.  Evidence code autocomplete using ECO term names

        1.  Search for ‘**direct assay**’

        2.  GO codes are indicated with bold three-letter GO code

    5.  Add a reference. Two options:

        1.  Cut and paste a DB and id, e.g. **PMID:31296532 OR**

        2.  Click on the +/lines symbol

            1.  Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF

            2.  Select **PMID**

            3.  Add identifier: **31296532**

8.  Add that a CC is ‘part of’ a cell

    1.  Click on the ‘more options’ icon on the far right of the annotation line

    2.  Scroll down to the Add option

    3.  Select Add ‘**part of**’ (Cell Type)

    4.  A new line for the ‘part of’ cell type and evidence will appear

    5.  Type in ‘**germ cell**’ and select the WBbt:0006796 from the
        autocomplete menu

    6.  Evidence code autocomplete using ECO term names

        1.  Search for ‘**direct assay**’

        2.  GO codes are indicated with bold three-letter GO code

    7.  Add a reference. Two options:

        1.  Cut and paste a DB and id, e.g. **PMID:31296532 OR**

        2.  Click on the +/lines symbol

            1.  Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF

            2.  Select **PMID**

            3.  Add identifier: **31296532**

    8.  Repeat steps i - vii to add ‘part of’ for tissue and organism contextual
        information, as needed. Note that organismal contextual information is
        not needed except for when relevant to multi-species processes.

### **Creating a Biological Process (BP) only annotation**

>   Click on the arrow to the left of the ‘Create Activity’ icon.

1.  Select ‘Create New BP Annotation’.

2.  Using C. elegans as an example:

    1.  Type in gene name: **skn-1**

    2.  Select the WBGene entry from the dropdown list

    3.  Gene products link out to respective gene product pages via dbxrefs.yaml

3.  Note that the BP only form automatically fills in the root Molecular
    Function GO term (GO:0003674). This is done because the GO-CAM data model
    requires an MF annotation in order to associate a gene with a BP.

4.  Select the appropriate relation between the root MF term and the GO BP term
    based on the experimental evidence you have in the paper. For example, a
    mutant phenotype may simply warrant ‘causally upstream of or within’.

5.  Add the BP

    1.  Search for ‘**innate immune response**’

    2.  Autocomplete options are presented in a pop-up window

    3.  Terms link out to AmiGO

    4.  Enter the appropriate evidence code from using ECO term names

        1.  Search for ‘**mutant phenotype**’

        2.  GO codes are indicated with bold three-letter GO code

    5.  Add a reference. Two options:

        1.  Cut and paste a DB and id, e.g. **PMID:30442878 OR**

        2.  Click on the +/lines symbol

6.  Add the CC

    1.  If applicable, add that the BP ‘occurs in’ a GO CC. Note that this is
        different from saying that the MF ‘occurs in’ a GO CC, which is the
        statement made in an Activity Unit.

    2.  Search for ‘**nucleus**’

    3.  Autocomplete options are presented in a pop-up window

    4.  Terms link out to AmiGO

    5.  Evidence code autocomplete using ECO term names

        1.  Search for ‘**direct assay**’

        2.  GO codes are indicated with bold three-letter GO code

    6.  Add a reference. Two options:

        1.  Cut and paste a DB and id, e.g. **PMID:30442878 OR**

        2.  Click on the +/lines symbol

            1.  Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF

            2.  Select **PMID**

            3.  Add identifier: **30442878**

7.  Adding contextual information to a BP only annotation can be done as for
    [Activity Units](#adding-contextual-information-to-a-basic-activity-unit)
    but note that contextual information cannot be added to the root MF term.

### **Creating a Cellular Component (CC) only annotation**

Click on the arrow to the left of the ‘Create Activity’ icon.

1.  Select ‘Create New CC Annotation’.

2.  Using C. elegans as an example:

    1.  Type in gene name: **skn-1**

    2.  Select the WBGene entry from the dropdown list

    3.  Gene products link out to respective gene product pages via dbxrefs.yaml

3.  Note that the CC only form creates annotations stating only that a gene
    product is ‘located in’ a given GO CC and is not making any claims about
    where the MF of that gene product may occur.

4.  Add the CC

    1.  Search for ‘**nucleus**’

    2.  Autocomplete options are presented in a pop-up window

    3.  Terms link out to AmiGO

    4.  Evidence code autocomplete using ECO term names

        1.  Search for ‘**direct assay**’

        2.  GO codes are indicated with bold three-letter GO code

    5.  Add a reference. Two options:

        1.  Cut and paste a DB and id, e.g. **PMID:30442878 OR**

        2.  Click on the +/lines symbol

            1.  Pop-up appears with a select drop-down of dbs for references:
                PMID, DOI, GO_REF

            2.  Select **PMID**

            3.  Add identifier: **30442878**

5.  Adding contextual information to a CC only annotation can be done as for
    [Activity Units](#adding-contextual-information-to-a-basic-activity-unit).

ADDING EXISTING ANNOTATIONS TO A MODEL
--------------------------------------

Curators may wish to construct a GO-CAM model using existing annotations.

To add an existing annotation, select the curation form you wish to use
(Activity, BP only, CC only).

Click on the ‘more options’ menu and select ‘Search Database’.

Available GO terms for each specific GO aspect are displayed on the left side of
the pop-up window.

Select the term you wish to use and all associated evidence will appear to the
right of the list.

Selected one or more terms and evidences for your model and click ‘Done’ to
enter the annotation into the form.

ADDING A NOT QUALIFIER TO AN ANNOTATION
---------------------------------------

In some cases, GO annotations may need to be qualified with a
‘[NOT](http://wiki.geneontology.org/index.php/Annotation_conventions)’
qualifier.

To add a ‘NOT’ qualifier to an annotation in the Noctua form, first select the
‘more options’ menu.

Select ‘NOT’ qualifier from the menu.

The resulting annotation will now have a label ‘IS NOT’ in the form and will be
output with the ‘NOT’ qualifier in the derived GPAD file.

Note that it is not possible to add the ‘NOT’ qualifier to contextual
information.

ADDING A ROOT NODE ANNOTATION
-----------------------------

Root node annotations can be readily added using the Noctua form.

To add a root node annotation, first select the version of the form (Activity
Unit, BP only, CC only) you wish to use.

Click on the ‘more options’ menu, select the ‘Easy Fill’ option, and then ‘Add
Root Term Value’.

The resulting root term, with appropriate evidence (ND evidence code and
GO_REF:0000015) will automatically be added to the form.

FURTHER EVIDENCE OPTIONS
------------------------

#### Adding More Evidence

More than one piece of evidence (i.e. ECO code, reference, and With) can be
added to an annotation.

To add more evidence to an annotation, click on the ‘more options’ menu,
navigate to ‘Evidence’ and select Add Evidence.

An additional line of evidence will be added to the form where you can enter new
evidence or clone existing evidence ([see below](#cloning-evidence)).

#### Cloning Evidence

To help avoid redundant work, evidence from one annotation in a model can be
cloned to use in a second annotation.

After entering an ontology term, click on the ‘more options’ menu, navigate to
‘Evidence’ and select Clone Evidence.

From the resulting pop-up window, select the evidence code and reference you
wish to clone and click ‘Done’.

#### Removing Evidence

Evidence can be removed from an annotation.

To remove evidence from an annotation, click on the ‘more options’ menu,
navigate to ‘Evidence’ and select Remove Evidence.

CLEARING VALUES FROM THE FORM
-----------------------------

While entering annotations, you can clear a line of annotation by selecting
‘Clear Value’ from the ‘more options’ menu.

EDITING ANNOTATIONS
-------------------

Annotations entered through the Noctua form can be edited via the annotation
table.

As you add annotations through the form, the gene products annotated will be
added to an alphabetized list to a table on the right side of the form.

From the table view of a model’s annotations, select the annotation you wish to
edit and click on the down arrow to open up the editing window.

Editable fields are denoted with an edit icon in the lower right corner of each
respective box.

Clicking on the edit icon will open a pop-up window that will allow you to
change the value of the field.

Note that relations are currently not editable, so if you need to change a
relation in one of your models, you need to use the graph editor.

MODEL METADATA
--------------

1.  Adding a title to a GO-CAM model

    1.  At the top of the form, click on the model state icon at the top of the
        page. When you first start a model, this will say ‘**Development**’.

    2.  By default, each model will be named ‘enabled by’ the first entity you
        added, e.g. ‘enabled by’ mpk-1.

    3.  In the Model Details editing window, you can update the title of your
        model to a more meaningful title, e.g. ‘*C. elegans* germ cell apoptosis
        in response to DNA damage’.

2.  Changing the ‘state’ of a GO-CAM model

    1.  By default, each new model is in the ‘Development’ state. This means
        that the model and its associated annotations (e.g. GPAD output) will
        not be publically available.

    2.  To change the state of a GO-CAM model, click on the model state icon at
        the top of the page. When you first start a model, this will say
        ‘**Development**’.

    3.  Select the appropriate model state from the drop-down menu:

        1.  Production (model and annotations will be made pubic)

        2.  Review (model should be reviewed by another curator)

        3.  Closed (?)

        4.  Delete (model should be permanently deleted)

### Changing the group associated with a curator

Curators using Noctua are associated with one or more curation groups.

>   Curation groups for curators are tracked in a metadata file, users.yaml

>   If you are associated with more than one curation groups then, by default,
>   the first group associated with your entry in the metadata file is the group
>   listed in the form.

>   To change your group, click on the model state icon at the top of the page.
>   When you first start a model, this will say ‘**Development**’.

>   Select the appropriate group for your current work by clicking on the
>   dropdown list in the Group box and highlighting the correct group.

SAVING ANNOTATIONS AND MODELS
-----------------------------

Each time the curators clicks on the Save button, the annotation(s) will be
saved and the resulting model also automatically saved. There is no need for the
curator to additionally save the model in the graph editor interface.

Questions:

Where will the Noctua Form be accessed from?

Workbenches menu on landing page?

Top of landing page (‘Create new model in form’)?

List of options next to existing models

Should we just have Form, Graph as options instead of Edit, Form?

General documentation needed (Tremayne)

What text is required for successful autocomplete for each menu?

e.g. Gene products names, synonyms, IDs (with or without DB prefix?)

gene or protein names - works

>   identifiers with prefix - works

>   identifiers with no prefix - doesn’t work

>   synonyms? - doesn’t appear to work

>   GO terms

>   ECO codes

>   References

Workflows

New Model - Paper Approach to Curation

1.  Has this paper already been curated?

    1.  Search using ART

        1.  Need clear documentation on paper id formats allowed for searching

        2.  Need a message to be clear when no annotations are found

            1.  Something like: ‘No annotations are found. Would you like to
                create a new model?’ with a link to a new, blank form.

        3.  Show the searched entity id at the top of ART

2.  Curator might also go directly to the Noctua form

    1.  Click on ‘Create New Model’ - is this working? I currently get an error
        message.

3.  Login
