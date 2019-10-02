import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NoctuaSharedModule } from '@noctua/shared.module';

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NoctuaSharedModule
    ],
})
export class NoctuaSearchBarModule {
}
