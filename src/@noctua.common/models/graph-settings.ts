import { FormControl, FormGroup } from "@angular/forms";


export class SettingsOptions {
  showAspect = false;
  showIsExtension = false;
  showEvidence = true;
  showEvidenceSummary = true;
  showReference = true;
  showEvidenceCode = true;
  showComments = true;
  showWith = true;
  showGroup = true;
  showContributor = true;
  showAddEvidenceButton = false;

  createSettingsForm() {
    return new FormGroup({
      showAspect: new FormControl(this.showAspect),
      showIsExtension: new FormControl(this.showIsExtension),
      showEvidence: new FormControl(this.showEvidence),
      showEvidenceSummary: new FormControl(this.showEvidenceSummary),
      showEvidenceCode: new FormControl(this.showEvidenceCode),
      showReference: new FormControl(this.showReference),
      showWith: new FormControl(this.showWith),
      showComments: new FormControl(this.showComments),
      showGroup: new FormControl(this.showGroup),
      showContributor: new FormControl(this.showContributor),
    });
  }

  populateSettings(value) {
    this.showAspect = value.showAspect;
    this.showIsExtension = value.showIsExtension;
    this.showEvidence = value.showEvidence;
    this.showReference = value.showReference;
    this.showEvidenceCode = value.showEvidenceCode;
    this.showEvidenceSummary = value.showEvidenceSummary;
    this.showWith = value.showWith;
    this.showComments = value.showComments
    this.showGroup = value.showGroup;
    this.showContributor = value.showContributor;
  }

  graphSettings() {
    this.showAspect = false;
    this.showIsExtension = false;
    this.showEvidence = true;
    this.showEvidenceSummary = true;
    this.showReference = true;
    this.showEvidenceCode = true;
    this.showComments = true;
    this.showWith = true;
    this.showGroup = false;
    this.showContributor = false;
  }
};