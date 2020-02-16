import { EventEmitter } from '@angular/core';

export class MapService {
    onDistrictSelected = new EventEmitter<String>();
    onYearChanged = new EventEmitter<number>();
}