export interface CamRow {
    treeLevel: number;
    expanded?: boolean,
    graph?: {};
    model?: {};
    annotatedEntity?: {};
    relationship?: string;
    aspect?: string;
    term?: {};
    relationshipExt?: string;
    extension?: {};
    evidence?: {};
    reference?: string;
    with?: string;
    assignedBy?: {};
    node: Node;
}