import { ActivityDisplayType } from "noctua-form-base";


export interface TableOptions {
  displayType: ActivityDisplayType;
  slimViewer: boolean;
  editableTerms?: boolean;
  editableEvidence?: boolean;
  editableReference?: boolean;
  editableWith?: boolean;
  editableRelation?: boolean;
  showMenu?: boolean;
};