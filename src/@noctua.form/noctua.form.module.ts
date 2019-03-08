import { NgModule } from '@angular/core';
import {
  NoctuaAnnotonConnectorService,
  NoctuaFormGridService,
  CamService
} from './services';

export * from './services'
export * from './models'

@NgModule({
  imports: [
  ],
  providers: [
    //  NoctuaFormGridService,
    //  CamService,
    // NoctuaAnnotonConnectorService
  ],
  exports: [
    //  NoctuaFormGridService,
    // CamService,
    //  NoctuaAnnotonConnectorService
  ],
})



export class NoctuaCommonModule { }
