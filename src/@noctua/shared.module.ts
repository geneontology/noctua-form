import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { NoctuaDirectivesModule } from '@noctua/directives/directives';
import { NoctuaPipesModule } from '@noctua/pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        NoctuaDirectivesModule,
        NoctuaPipesModule
    ],
    exports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        NoctuaDirectivesModule,
        NoctuaPipesModule
    ]
})

export class NoctuaSharedModule { }
