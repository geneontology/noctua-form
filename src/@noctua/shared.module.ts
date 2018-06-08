import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { NoctuaDirectivesModule } from '@noctua/directives/directives';
import { NoctuaPipesModule } from '@noctua/pipes/pipes.module';

@NgModule({
    imports  : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,

        NoctuaDirectivesModule,
        NoctuaPipesModule
    ],
    exports  : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,

        NoctuaDirectivesModule,
        NoctuaPipesModule
    ]
})
export class NoctuaSharedModule
{
}
