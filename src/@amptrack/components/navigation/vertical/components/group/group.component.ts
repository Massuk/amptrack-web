import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    forwardRef,
    inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AmpTrackNavigationService } from '@amptrack/components/navigation/navigation.service';
import { AmpTrackNavigationItem } from '@amptrack/components/navigation/navigation.types';
import { AmpTrackVerticalNavigationBasicItemComponent } from '@amptrack/components/navigation/vertical/components/basic/basic.component';
import { AmpTrackVerticalNavigationCollapsableItemComponent } from '@amptrack/components/navigation/vertical/components/collapsable/collapsable.component';
import { AmpTrackVerticalNavigationDividerItemComponent } from '@amptrack/components/navigation/vertical/components/divider/divider.component';
import { AmpTrackVerticalNavigationSpacerItemComponent } from '@amptrack/components/navigation/vertical/components/spacer/spacer.component';
import { AmpTrackVerticalNavigationComponent } from '@amptrack/components/navigation/vertical/vertical.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'amptrack-vertical-navigation-group-item',
    templateUrl: './group.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        MatIconModule,
        AmpTrackVerticalNavigationBasicItemComponent,
        AmpTrackVerticalNavigationCollapsableItemComponent,
        AmpTrackVerticalNavigationDividerItemComponent,
        forwardRef(() => AmpTrackVerticalNavigationGroupItemComponent),
        AmpTrackVerticalNavigationSpacerItemComponent,
    ],
})
export class AmpTrackVerticalNavigationGroupItemComponent
    implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_autoCollapse: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _amptrackNavigationService = inject(AmpTrackNavigationService);

    @Input() autoCollapse: boolean;
    @Input() item: AmpTrackNavigationItem;
    @Input() name: string;

    private _amptrackVerticalNavigationComponent: AmpTrackVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._amptrackVerticalNavigationComponent =
            this._amptrackNavigationService.getComponent(this.name);

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

    // -----------------------------------------------------------------------------------------------------
    // @ Métodos públicos
    // -----------------------------------------------------------------------------------------------------
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
