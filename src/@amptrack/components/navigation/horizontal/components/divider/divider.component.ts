import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { AmpTrackHorizontalNavigationComponent } from '@amptrack/components/navigation/horizontal/horizontal.component';
import { AmpTrackNavigationService } from '@amptrack/components/navigation/navigation.service';
import { AmpTrackNavigationItem } from '@amptrack/components/navigation/navigation.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'amptrack-horizontal-navigation-divider-item',
    templateUrl: './divider.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass],
})
export class AmpTrackHorizontalNavigationDividerItemComponent
    implements OnInit, OnDestroy
{
    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _amptrackNavigationService = inject(AmpTrackNavigationService);

    @Input() item: AmpTrackNavigationItem;
    @Input() name: string;

    private _amptrackHorizontalNavigationComponent: AmpTrackHorizontalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the parent navigation component
        this._amptrackHorizontalNavigationComponent =
            this._amptrackNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._amptrackHorizontalNavigationComponent.onRefreshed
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                // Mark for check
                this._changeDetectorRef.markForCheck();
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
}
