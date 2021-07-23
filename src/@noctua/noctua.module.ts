import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { NOCTUA_CONFIG, NoctuaConfigService } from './services/config.service';
import { NoctuaMatchMediaService } from './services/match-media.service';
import { NoctuaSplashScreenService } from './services/splash-screen.service';

@NgModule({
    entryComponents: [],
    providers: [
        NoctuaConfigService,
        NoctuaMatchMediaService,
        NoctuaSplashScreenService,
    ]
})
export class NoctuaModule {
    constructor(@Optional() @SkipSelf() parentModule: NoctuaModule) {
        if (parentModule) {
            throw new Error('NoctuaModule is already loaded. Import it in the AppModule only!');
        }
    }

    static forRoot(config): ModuleWithProviders<NoctuaModule> {
        return {
            ngModule: NoctuaModule,
            providers: [
                {
                    provide: NOCTUA_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
