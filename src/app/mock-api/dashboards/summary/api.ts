import { Injectable } from '@angular/core';
import { AmpTrackMockApiService } from '@amptrack/lib/mock-api';
import { summary as summaryData } from 'app/mock-api/dashboards/summary/data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class SummaryMockApi {
    private _summary: any = summaryData;
    constructor(private _amptrackMockApiService: AmpTrackMockApiService) {
        this.registerHandlers();
    }
    registerHandlers(): void {
        this._amptrackMockApiService
            .onGet('api/dashboards/summary')
            .reply(() => [200, cloneDeep(this._summary)]);
    }
}
