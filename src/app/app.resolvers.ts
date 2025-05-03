import { inject } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { NotificationService } from './core/notification/notification.service';
import { forkJoin } from 'rxjs';

export const initialDataResolver = () => {
    const navigationService = inject(NavigationService);
    const notificationService = inject(NotificationService);
    return forkJoin([
        navigationService.get(),
        notificationService.loadAll(),
    ]);
};
