import { FormControl, FormGroup } from "@angular/forms";


export class SettingsOptions {
  showEvidence = true;
  showReference = true;
  showEvidenceCode = true;
  showWith = true;
  showGroup = true;
  showContributor = true;

  createSettingsForm() {
    return new FormGroup({
      showEvidence: new FormControl(this.showEvidence),
      showEvidenceCode: new FormControl(this.showEvidenceCode),
      showReference: new FormControl(this.showReference),
      showWith: new FormControl(this.showWith),
      showGroup: new FormControl(this.showGroup),
      showContributor: new FormControl(this.showWith),
    });
  }

  populateSettings(value) {
    this.showEvidence = value.showEvidence;
    this.showReference = value.showReference;
    this.showEvidenceCode = value.showEvidenceCode;
    this.showWith = value.showWith;
    this.showGroup = value.showGroup;
    this.showContributor = value.showContributor;
  }

  graphSettings() {
    this.showEvidence = false;
    this.showReference = false;
    this.showEvidenceCode = false;
    this.showWith = false;
    this.showGroup = false;
    this.showContributor = false;
  }
};