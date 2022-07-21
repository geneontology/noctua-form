import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementPanelComponent } from './components/announcement-panel/announcement-panel.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NoctuaSharedModule } from '@noctua/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    FlexLayoutModule,
    NoctuaSharedModule
  ],
  exports: [
    AnnouncementPanelComponent
  ],
  declarations: [
    AnnouncementPanelComponent],
})
export class NoctuaAnnouncementModule { }
