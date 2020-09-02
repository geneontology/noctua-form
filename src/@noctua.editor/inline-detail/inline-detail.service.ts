import { Injectable, Inject, Injector, ElementRef, ComponentRef, ViewChild } from '@angular/core';
import {
    Overlay,
    OverlayRef,
    OverlayConfig,
    OriginConnectionPosition,
    OverlayConnectionPosition,
    PositionStrategy
} from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { DetailDropdownOverlayRef } from './detail-dropdown/detail-dropdown-ref';
import { detailDropdownData } from './detail-dropdown/detail-dropdown.tokens';

import { NoctuaDetailDropdownComponent } from './detail-dropdown/detail-dropdown.component';

export interface SearchCriiteria {
    gp: string;
    url: string;
}

export interface DetailDropdownDialogConfig {
    panelClass?: string;
    hasBackdrop?: boolean;
    backdropClass?: string;
    positionStrategy?: PositionStrategy;
    width?: string;
    data?: any;
}

const DEFAULT_CONFIG: DetailDropdownDialogConfig = {
    hasBackdrop: false,
    backdropClass: 'dark-backdrop',
    panelClass: 'tm-file-preview-dialog-panel',
    // width: '600px',
    data: null
};

@Injectable({
    providedIn: 'root'
})
export class InlineDetailService {

    constructor(
        private injector: Injector,
        private overlay: Overlay) { }
    private dialogRef: DetailDropdownOverlayRef;


    open(elementToConnectTo: ElementRef, config: DetailDropdownDialogConfig = {}) {
        const dialogConfig = { ...DEFAULT_CONFIG, ...config };


        if (this.dialogRef) {
            this.dialogRef.close();
        }
        dialogConfig['positionStrategy'] = this._getPosition(elementToConnectTo);
        // dialogConfig['width'] = '420px';
        const originRect = elementToConnectTo.nativeElement;
        const overlayRef = this.createOverlay(dialogConfig);
        const dialogRef = new DetailDropdownOverlayRef(overlayRef);
        const overlayComponent = this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);

        overlayRef.backdropClick().subscribe(_ => dialogRef.close());

        this.dialogRef = dialogRef;
        return dialogRef;
    }

    close(data): void {
        //  this.overlayRef.dispose();
    }

    private createInjector(config: DetailDropdownDialogConfig, dialogRef: DetailDropdownOverlayRef): PortalInjector {
        const injectionTokens = new WeakMap();

        injectionTokens.set(DetailDropdownOverlayRef, dialogRef);
        injectionTokens.set(detailDropdownData, config.data);

        return new PortalInjector(this.injector, injectionTokens);
    }

    private attachDialogContainer(overlayRef: OverlayRef, config: DetailDropdownDialogConfig, dialogRef: DetailDropdownOverlayRef) {
        const injector = this.createInjector(config, dialogRef);

        const containerPortal = new ComponentPortal(NoctuaDetailDropdownComponent, null, injector);
        const containerRef: ComponentRef<NoctuaDetailDropdownComponent> = overlayRef.attach(containerPortal);

        return containerRef.instance;
    }

    private createOverlay(config: DetailDropdownDialogConfig) {
        const overlayConfig = this.getOverlayConfig(config);

        return this.overlay.create(overlayConfig);
    }

    private getOverlayConfig(config: DetailDropdownDialogConfig): OverlayConfig {
        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            width: config.width,
            panelClass: config.panelClass,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: config.positionStrategy
        });

        return overlayConfig;
    }

    private _getPosition(elementToConnectTo: ElementRef) {

        return this.overlay.position()
            .flexibleConnectedTo(elementToConnectTo)
            .withFlexibleDimensions(true)
            .withPush(true)
            .withPositions([{
                originX: 'end',
                originY: 'center',
                overlayX: 'start',
                overlayY: 'center',
            }])
        //.withDirection('ltr')
        //.withFallbackPosition(origin.bottomRight, overlay.topRight)
        //.withFallbackPosition(origin.topLeft, overlay.bottomLeft)
        //.withFallbackPosition(origin.topRight, overlay.bottomRight)
        // .withFallbackPosition(origin.topCenter, overlay.bottomCenter)
        // .withFallbackPosition(origin.bottomCenter, overlay.topCenter)
    }

}
