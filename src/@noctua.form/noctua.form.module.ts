import { NgModule } from '@angular/core';
import {
  NoctuaAnnotonConnectorService,
  NoctuaAnnotonFormService,
  CamService
} from './services';

export * from './'

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
