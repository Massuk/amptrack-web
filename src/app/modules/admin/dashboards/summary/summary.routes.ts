import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { SummaryComponent } from 'app/modules/admin/dashboards/summary/summary.component';
import { SummaryService } from 'app/modules/admin/dashboards/summary/summary.service';

export default [
    {
        path: '',
        component: SummaryComponent,
        resolve: {
            data: () => inject(SummaryService).getData(),
        },
    },
] as Routes;
