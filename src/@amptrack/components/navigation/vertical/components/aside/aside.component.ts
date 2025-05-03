import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router } from '@angular/router';
import { AmpTrackNavigationService } from '@amptrack/components/navigation/navigation.service';
import { AmpTrackNavigationItem } from '@amptrack/components/navigation/navigation.types';
import { AmpTrackVerticalNavigationBasicItemComponent } from '@amptrack/components/navigation/vertical/components/basic/basic.component';
import { AmpTrackVerticalNavigationCollapsableItemComponent } from '@amptrack/components/navigation/vertical/components/collapsable/collapsable.component';
import { AmpTrackVerticalNavigationDividerItemComponent } from '@amptrack/components/navigation/vertical/components/divider/divider.component';
import { AmpTrackVerticalNavigationGroupItemComponent } from '@amptrack/components/navigation/vertical/components/group/group.component';
import { AmpTrackVerticalNavigationSpacerItemComponent } from '@amptrack/components/navigation/vertical/components/spacer/spacer.component';
import { AmpTrackVerticalNavigationComponent } from '@amptrack/components/navigation/vertical/vertical.component';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
    selector: 'amptrack-vertical-navigation-aside-item',
    templateUrl: './aside.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        MatTooltipModule,
        MatIconModule,
        AmpTrackVerticalNavigationBasicItemComponent,
        AmpTrackVerticalNavigationCollapsableItemComponent,
        AmpTrackVerticalNavigationDividerItemComponent,
        AmpTrackVerticalNavigationGroupItemComponent,
        AmpTrackVerticalNavigationSpacerItemComponent,
    ],
})
export class AmpTrackVerticalNavigationAsideItemComponent
    implements OnChanges, OnInit, OnDestroy
{
    static ngAcceptInputType_autoCollapse: BooleanInput;
    static ngAcceptInputType_skipChildren: BooleanInput;

    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _router = inject(Router);
    private _amptrackNavigationService = inject(AmpTrackNavigationService);

    @Input() activeItemId: string;
    @Input() autoCollapse: boolean;
    @Input() item: AmpTrackNavigationItem;
    @Input() name: string;
    @Input() skipChildren: boolean;

    active: boolean = false;
    private _amptrackVerticalNavigationComponent: AmpTrackVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnChanges(changes: SimpleChanges): void {
        if ('activeItemId' in changes) {
            this._markIfActive(this._router.url);
        }
    }

    ngOnInit(): void {
        this._markIfActive(this._router.url);

        this._router.events
            .pipe(
                filter(
                    (event): event is NavigationEnd =>
                        event instanceof NavigationEnd
                ),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((event: NavigationEnd) => {
                this._markIfActive(event.urlAfterRedirects);
            });

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

    // -----------------------------------------------------------------------------------------------------
    // @ Métodos privados
    // -----------------------------------------------------------------------------------------------------
    private _hasActiveChild(
        item: AmpTrackNavigationItem,
        currentUrl: string
    ): boolean {
        const children = item.children;

        if (!children) {
            return false;
        }

        for (const child of children) {
            if (child.children) {
                if (this._hasActiveChild(child, currentUrl)) {
                    return true;
                }
            }

            if (child.type !== 'basic') {
                continue;
            }

            if (
                child.link &&
                this._router.isActive(child.link, child.exactMatch || false)
            ) {
                return true;
            }
        }

        return false;
    }

    private _markIfActive(currentUrl: string): void {
        this.active = this.activeItemId === this.item.id;
        if (this._hasActiveChild(this.item, currentUrl)) {
            this.active = true;
        }
        this._changeDetectorRef.markForCheck();
    }
}
