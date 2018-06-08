import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[noctuaWidgetToggle]'
})
export class NoctuaWidgetToggleDirective {
    constructor(public el: ElementRef) {
    }
}
