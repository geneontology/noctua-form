import { NgModule } from '@angular/core';

import { NoctuaWidgetComponent } from './widget.component';
import { NoctuaWidgetToggleDirective } from './widget-toggle.directive';

@NgModule({
    declarations: [
        NoctuaWidgetComponent,
        NoctuaWidgetToggleDirective
    ],
    exports: [
        NoctuaWidgetComponent,
        NoctuaWidgetToggleDirective
    ],
})
export class NoctuaWidgetModule {
}
