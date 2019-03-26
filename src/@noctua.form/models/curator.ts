export class Curator {
    orcid: string;
    name: string;
    group: any = {};
    cams: number;
    _groups?: any = []

    constructor() {

    }

    set groups(groups) {
        this._groups = groups;

        if (groups && groups.length > 0) {
            this.group = groups[0];
        }
    }

    get groups() {
        return this._groups;
    }
}