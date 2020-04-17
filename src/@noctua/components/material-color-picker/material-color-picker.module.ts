import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NoctuaPipesModule } from '../../pipes/pipes.module';
import { NoctuaMaterialColorPickerComponent } from './material-color-picker.component';

@NgModule({
    declarations: [
        NoctuaMaterialColorPickerComponent
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatRippleModule,
        NoctuaPipesModule
    ],
    exports: [
        NoctuaMaterialColorPickerComponent
    ],
})
export class NoctuaMaterialColorPickerModule {
}
