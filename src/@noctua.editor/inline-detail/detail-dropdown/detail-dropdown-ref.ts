import { OverlayRef } from '@angular/cdk/overlay';

export class DetailDropdownOverlayRef {

    constructor(private overlayRef: OverlayRef) { }

    close(): void {
        this.overlayRef.dispose();
    }
}
