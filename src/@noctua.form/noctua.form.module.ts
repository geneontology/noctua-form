import { NgModule } from '@angular/core';
import {
  NoctuaAnnotonConnectorService,
  NoctuaAnnotonFormService,
  CamService
} from './services';

export * from './services'
export * from './models'

@NgModule({
  imports: [
  ],
  providers: [
    //  NoctuaAnnotonFormService,
    //  CamService,
    // NoctuaAnnotonConnectorService
  ],
  exports: [
    //  NoctuaAnnotonFormService,
    // CamService,
    //  NoctuaAnnotonConnectorService
  ],
})



export class NoctuaFormModule { }
