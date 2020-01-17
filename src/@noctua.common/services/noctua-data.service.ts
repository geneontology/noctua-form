import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const require: any;
const organisms = require('@noctua.common/data/organisms.json');

@Injectable({
  providedIn: 'root'
})
export class NoctuaDataService {

  constructor(private httpClient: HttpClient) {
  }

  get organisms() {
    return organisms;
  }
}
