import { NgModule } from '@angular/core';
import { NoctuaAnnotonConnectorService } from './services/annoton-connector.service';
import { NoctuaFormGridService } from './services/form-grid.service';
import { CamService } from './services/cam.service';


@NgModule({
  imports: [
  ],
  providers: [
    NoctuaFormGridService,
    CamService,
    NoctuaAnnotonConnectorService
  ],
  exports: [
    //  NoctuaFormGridService,
    // CamService,
    //  NoctuaAnnotonConnectorService
  ],
})

export class NoctuaCommonModule { }
