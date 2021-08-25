import { NoctuaUtils } from '@noctua/utils/noctua-utils';
import { each, find, remove } from 'lodash';


export class ArtBasketItem {

    displayId: string;

    constructor(
        public id: string,
        public title: string,
        public dateAdded: Date,
    ) {
        this.displayId = NoctuaUtils.cleanID(id);
    }
}

export class ArtBasket {


    cams: ArtBasketItem[] = [];

    constructor(artBasket?) {
        if (artBasket) {
            this.addCamsToBasket(artBasket.cams);
        }
    }

    addCamsToBasket(cams: any[]) {
        const self = this;

        each(cams, (inCam) => {
            const found = find(this.cams, { id: inCam.id });
            if (!found) {
                const cam = new ArtBasketItem(inCam.id, inCam.title, inCam.dateAdded);
                self.cams.push(cam);
            }
        });

        self.sortCams();
    }

    addCamToBasket(id: string, title: string): ArtBasketItem {
        const self = this;

        const found = find(this.cams, { id: id });

        if (found) {
            return null;
        }

        const cam = new ArtBasketItem(id, title, new Date());

        self.cams.push(cam);
        self.sortCams();

        return cam;
    }

    removeCamFromBasket(id: string) {
        remove(this.cams, { id: id });
    }

    clearBasket() {
        this.cams = [];
    }

    sortCams() {
        this.cams.sort(this._compareDateReviewAdded);
    }

    private _compareDateReviewAdded(a: ArtBasketItem, b: ArtBasketItem): number {
        if (a.dateAdded > b.dateAdded) {
            return -1;
        } else {
            return 1;
        }
    }
}
