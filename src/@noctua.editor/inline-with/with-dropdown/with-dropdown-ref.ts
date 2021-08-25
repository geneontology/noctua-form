import { OverlayRef } from '@angular/cdk/overlay';

export class WithDropdownOverlayRef {

    constructor(private overlayRef: OverlayRef) { }

    close(): void {
        this.overlayRef.dispose();
    }
}
