import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { HistoryComponent } from 'app/modules/admin/apps/history/history.component';
import { HistoryService } from 'app/core/history/history.service';
import { HistoryListComponent } from 'app/modules/admin/apps/history/list/list.component';
import { catchError, throwError } from 'rxjs';

export default [
    {
        path: '',
        component: HistoryListComponent,
        resolve: {
            data: () => inject(HistoryService).getAll(),
        },
    },
] as Routes;
