export class Contributor {
    orcid: string;
    name?: string;
    group?: any = {};
    cams?: number;
    _groups?: any = []


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