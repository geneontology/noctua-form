import { ActivityError, ActivityNode, Entity, ErrorLevel, ErrorType } from '../../../models/activity';

export enum ViolationType {
  cardinality = 'cardinality',
  relation = 'relations'
}

export class Violation {
  protected _message: string;
  constructor(public node: Partial<ActivityNode>, public type: ViolationType) {
  }

  getDisplayError() { }

  get message() {
    return this._message;
  }
}

export class CardinalityViolation extends Violation {
  subject: Partial<ActivityNode>;
  constructor(public override node: Partial<ActivityNode>,
    public predicate: Entity,
    public nobjects: number,
    public cardinality: string) {
    super(node, ViolationType.cardinality);
    this.subject = node;
  }

  override get message() {
    this._message = `Only one ${this.predicate?.label} is allowed`
    return this._message;
  }

  override getDisplayError() {
    const self = this;
    const meta = {
      aspect: '',
      subjectNode: {
        label: self.subject?.term?.label
      },
      edge: {
        label: self.predicate?.label
      },
    };

    const error = new ActivityError(ErrorLevel.error, ErrorType.cardinality, self.message, meta);

    return error;
  }
}

export class RelationViolation extends Violation {
  subject: Partial<ActivityNode>;
  predicate: Entity;
  object: Partial<ActivityNode>;

  constructor(public override node: Partial<ActivityNode>) {
    super(node, ViolationType.relation);
    this.subject = node;
  }

  override get message() {
    this._message = `Incorrect relationship between ${this.subject?.term?.label} and ${this.object?.term?.label}`;
    return this._message;
  }

  override getDisplayError() {
    const self = this;
    const meta = {
      aspect: '',
      subjectNode: {
        label: self.subject?.term?.label
      },
      edge: {
        label: self.predicate?.label
      },
      objectNode: {
        label: self.object?.term?.label ? self.object?.term?.label : self.object?.term?.id
      },
    };

    const error = new ActivityError(ErrorLevel.error, ErrorType.relation, self.message, meta);

    return error;
  }
}



