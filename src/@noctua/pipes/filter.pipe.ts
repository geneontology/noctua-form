import { Pipe, PipeTransform } from '@angular/core';
import { NoctuaUtils } from '../utils/noctua-utils';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
    transform(mainArr: any[], searchText: string, property: string): any {
        return NoctuaUtils.filterArrayByString(mainArr, searchText);
    }
}
