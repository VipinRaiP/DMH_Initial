import { EventEmitter } from '@angular/core';

export class MapService {
    onDistrictSelected = new EventEmitter<any>();
    onYearChanged = new EventEmitter<number>();
}