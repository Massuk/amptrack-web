import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AmpTrackFullscreenComponent } from '@amptrack/components/fullscreen';
import { AmpTrackLoadingBarComponent } from '@amptrack/components/loading-bar';
import {
    AmpTrackHorizontalNavigationComponent,
    AmpTrackNavigationService,
    AmpTrackVerticalNavigationComponent,
} from '@amptrack/components/navigation';
import { AmpTrackMediaWatcherService } from '@amptrack/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'centered-layout',
    templateUrl: './centered.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        AmpTrackLoadingBarComponent,
        AmpTrackVerticalNavigationComponent,
        AmpTrackHorizontalNavigationComponent,
        MatButtonModule,
        MatIconModule,
        AmpTrackFullscreenComponent,
        NotificationsComponent,
        UserComponent,
        RouterOutlet,
    ],
})
export class CenteredLayoutComponent implements OnInit, OnDestroy {
    navigation: Navigation;
    isScreenSmall: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _amptrackMediaWatcherService: AmpTrackMediaWatcherService,
        private _amptrackNavigationService: AmpTrackNavigationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to media changes
        this._amptrackMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Métodos públicos
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._amptrackNavigationService.getComponent<AmpTrackVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
