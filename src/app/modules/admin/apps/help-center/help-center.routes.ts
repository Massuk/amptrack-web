import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { HelpCenterFaqsComponent } from 'app/modules/admin/apps/help-center/faqs/faqs.component';
import { HelpCenterComponent } from 'app/modules/admin/apps/help-center/help-center.component';
import { HelpCenterService } from 'app/modules/admin/apps/help-center/help-center.service';
import { HelpCenterSupportComponent } from 'app/modules/admin/apps/help-center/support/support.component';

export default [
    {
        path: '',
        component: HelpCenterComponent,
        resolve: {
            faqs: () =>
                inject(HelpCenterService).getFaqsByCategory('most-asked'),
        },
    },
    {
        path: 'faqs',
        component: HelpCenterFaqsComponent,
        resolve: {
            faqs: () => inject(HelpCenterService).getAllFaqs(),
        },
    },
    {
        path: 'support',
        component: HelpCenterSupportComponent,
    },
] as Routes;
