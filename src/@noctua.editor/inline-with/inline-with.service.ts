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
import { WithDropdownOverlayRef } from './with-dropdown/with-dropdown-ref';
import { withDropdownData } from './with-dropdown/with-dropdown.tokens';
import { NoctuaWithDropdownComponent } from './with-dropdown/with-dropdown.component';

export interface SearchCriiteria {
    gp: string;
    url: string;
}

export interface WithDropdownDialogConfig {
    panelClass?: string;
    hasBackdrop?: boolean;
    backdropClass?: string;
    positionStrategy?: PositionStrategy;
    width?: string;
    data?: any;
}

const DEFAULT_CONFIG: WithDropdownDialogConfig = {
    hasBackdrop: true,
    backdropClass: 'dark-backdrop',
    panelClass: 'tm-file-preview-dialog-panel',
    // width: '600px',
    data: null
};

@Injectable({
    providedIn: 'root'
})
export class InlineWithService {

    constructor(
        private injector: Injector,
        private overlay: Overlay) { }


    open(elementToConnectTo: ElementRef, config: WithDropdownDialogConfig = {}) {
        const dialogConfig = { ...DEFAULT_CONFIG, ...config };

        dialogConfig['positionStrategy'] = this._getPosition(elementToConnectTo);
        // dialogConfig['width'] = '420px';
        const originRect = elementToConnectTo.nativeElement;
        const overlayRef = this.createOverlay(dialogConfig);
        const dialogRef = new WithDropdownOverlayRef(overlayRef);
        const overlayComponent = this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);

        overlayRef.backdropClick().subscribe(_ => dialogRef.close());

        return dialogRef;
    }

    close(data): void {
        //  this.overlayRef.dispose();
    }

    private createInjector(config: WithDropdownDialogConfig, dialogRef: WithDropdownOverlayRef): PortalInjector {
        const injectionTokens = new WeakMap();

        injectionTokens.set(WithDropdownOverlayRef, dialogRef);
        injectionTokens.set(withDropdownData, config.data);

        return new PortalInjector(this.injector, injectionTokens);
    }

    private attachDialogContainer(overlayRef: OverlayRef, config: WithDropdownDialogConfig, dialogRef: WithDropdownOverlayRef) {
        const injector = this.createInjector(config, dialogRef);

        const containerPortal = new ComponentPortal(NoctuaWithDropdownComponent, null, injector);
        const containerRef: ComponentRef<NoctuaWithDropdownComponent> = overlayRef.attach(containerPortal);

        return containerRef.instance;
    }

    private createOverlay(config: WithDropdownDialogConfig) {
        const overlayConfig = this.getOverlayConfig(config);

        return this.overlay.create(overlayConfig);
    }

    private getOverlayConfig(config: WithDropdownDialogConfig): OverlayConfig {
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
        const origin = {
            topLeft: { originX: 'start', originY: 'top' } as OriginConnectionPosition,
            topRight: { originX: 'end', originY: 'top' } as OriginConnectionPosition,
            bottomLeft: { originX: 'start', originY: 'bottom' } as OriginConnectionPosition,
            bottomRight: { originX: 'end', originY: 'bottom' } as OriginConnectionPosition,
            topCenter: { originX: 'center', originY: 'top' } as OriginConnectionPosition,
            bottomCenter: { originX: 'center', originY: 'bottom' } as OriginConnectionPosition
        };

        const overlay = {
            topLeft: { overlayX: 'start', overlayY: 'top' } as OverlayConnectionPosition,
            topRight: { overlayX: 'end', overlayY: 'top' } as OverlayConnectionPosition,
            bottomLeft: { overlayX: 'start', overlayY: 'bottom' } as OverlayConnectionPosition,
            bottomRight: { overlayX: 'end', overlayY: 'bottom' } as OverlayConnectionPosition,
            topCenter: { overlayX: 'center', overlayY: 'top' } as OverlayConnectionPosition,
            bottomCenter: { overlayX: 'center', overlayY: 'bottom' } as OverlayConnectionPosition
        };

        return this.overlay.position()
            .flexibleConnectedTo(elementToConnectTo)
            .withFlexibleDimensions(true)
            .withPush(true)
            .withPositions([{
                overlayX: 'end',
                overlayY: 'top',
                originX: 'end',
                originY: 'bottom'
            }]);
        //.withOffsetY(1)
        //.withDirection('ltr')
        //.withFallbackPosition(origin.bottomRight, overlay.topRight)
        //.withFallbackPosition(origin.topLeft, overlay.bottomLeft)
        //.withFallbackPosition(origin.topRight, overlay.bottomRight)
        // .withFallbackPosition(origin.topCenter, overlay.bottomCenter)
        // .withFallbackPosition(origin.bottomCenter, overlay.topCenter)
    }

    getLink() {

    }
}
