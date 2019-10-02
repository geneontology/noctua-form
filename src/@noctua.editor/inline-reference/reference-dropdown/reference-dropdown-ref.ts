import { OverlayRef } from '@angular/cdk/overlay';

export class ReferenceDropdownOverlayRef {

    constructor(private overlayRef: OverlayRef) { }

    close(): void {
        this.overlayRef.dispose();
    }
}
