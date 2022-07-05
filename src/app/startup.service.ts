import { Injectable } from '@angular/core';
import { NoctuaDataService } from '@noctua.common/services/noctua-data.service';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class StartupService {

  constructor(
    private dataService: NoctuaDataService
  ) {
    const self = this;

  }

  loadData() {
    return this.dataService.setup();
  }

}




