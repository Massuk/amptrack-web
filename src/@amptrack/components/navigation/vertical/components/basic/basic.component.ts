import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    IsActiveMatchOptions,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';
import { AmpTrackNavigationService } from '@amptrack/components/navigation/navigation.service';
import { AmpTrackNavigationItem } from '@amptrack/components/navigation/navigation.types';
import { AmpTrackVerticalNavigationComponent } from '@amptrack/components/navigation/vertical/vertical.component';
import { AmpTrackUtilsService } from '@amptrack/services/utils/utils.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'amptrack-vertical-navigation-basic-item',
    templateUrl: './basic.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        RouterLink,
        RouterLinkActive,
        MatTooltipModule,
        NgTemplateOutlet,
        MatIconModule,
    ],
})
export class AmpTrackVerticalNavigationBasicItemComponent
    implements OnInit, OnDestroy
{
    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _amptrackNavigationService = inject(AmpTrackNavigationService);
    private _amptrackUtilsService = inject(AmpTrackUtilsService);

    @Input() item: AmpTrackNavigationItem;
    @Input() name: string;

    isActiveMatchOptions: IsActiveMatchOptions =
        this._amptrackUtilsService.subsetMatchOptions;

    private _amptrackVerticalNavigationComponent: AmpTrackVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        this.isActiveMatchOptions =
            this.item.isActiveMatchOptions ?? this.item.exactMatch
                ? this._amptrackUtilsService.exactMatchOptions
                : this._amptrackUtilsService.subsetMatchOptions;

        this._amptrackVerticalNavigationComponent =
            this._amptrackNavigationService.getComponent(this.name);

        this._changeDetectorRef.markForCheck();

        this._amptrackVerticalNavigationComponent.onRefreshed
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
