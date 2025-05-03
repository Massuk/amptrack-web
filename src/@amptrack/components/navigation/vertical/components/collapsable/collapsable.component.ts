import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    forwardRef,
    inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router } from '@angular/router';
import { amptrackAnimations } from '@amptrack/animations';
import { AmpTrackNavigationService } from '@amptrack/components/navigation/navigation.service';
import { AmpTrackNavigationItem } from '@amptrack/components/navigation/navigation.types';
import { AmpTrackVerticalNavigationBasicItemComponent } from '@amptrack/components/navigation/vertical/components/basic/basic.component';
import { AmpTrackVerticalNavigationDividerItemComponent } from '@amptrack/components/navigation/vertical/components/divider/divider.component';
import { AmpTrackVerticalNavigationGroupItemComponent } from '@amptrack/components/navigation/vertical/components/group/group.component';
import { AmpTrackVerticalNavigationSpacerItemComponent } from '@amptrack/components/navigation/vertical/components/spacer/spacer.component';
import { AmpTrackVerticalNavigationComponent } from '@amptrack/components/navigation/vertical/vertical.component';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
    selector: 'amptrack-vertical-navigation-collapsable-item',
    templateUrl: './collapsable.component.html',
    animations: amptrackAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        MatTooltipModule,
        MatIconModule,
        AmpTrackVerticalNavigationBasicItemComponent,
        forwardRef(() => AmpTrackVerticalNavigationCollapsableItemComponent),
        AmpTrackVerticalNavigationDividerItemComponent,
        AmpTrackVerticalNavigationGroupItemComponent,
        AmpTrackVerticalNavigationSpacerItemComponent,
    ],
})
export class AmpTrackVerticalNavigationCollapsableItemComponent
    implements OnInit, OnDestroy
{
    static ngAcceptInputType_autoCollapse: BooleanInput;

    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _router = inject(Router);
    private _amptrackNavigationService = inject(AmpTrackNavigationService);

    @Input() autoCollapse: boolean;
    @Input() item: AmpTrackNavigationItem;
    @Input() name: string;

    isCollapsed: boolean = true;
    isExpanded: boolean = false;
    private _amptrackVerticalNavigationComponent: AmpTrackVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    @HostBinding('class') get classList(): any {
        return {
            'amptrack-vertical-navigation-item-collapsed': this.isCollapsed,
            'amptrack-vertical-navigation-item-expanded': this.isExpanded,
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    ngOnInit(): void {
        this._amptrackVerticalNavigationComponent =
            this._amptrackNavigationService.getComponent(this.name);

        if (this._hasActiveChild(this.item, this._router.url)) {
            this.expand();
        }
        else {
            if (this.autoCollapse) {
                this.collapse();
            }
        }

        this._amptrackVerticalNavigationComponent.onCollapsableItemCollapsed
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((collapsedItem) => {
                if (collapsedItem === null) {
                    return;
                }

                if (this._isChildrenOf(collapsedItem, this.item)) {
                    this.collapse();
                }
            });

        if (this.autoCollapse) {
            this._amptrackVerticalNavigationComponent.onCollapsableItemExpanded
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((expandedItem) => {
                    if (expandedItem === null) {
                        return;
                    }

                    if (this._isChildrenOf(this.item, expandedItem)) {
                        return;
                    }

                    if (this._hasActiveChild(this.item, this._router.url)) {
                        return;
                    }

                    if (this.item === expandedItem) {
                        return;
                    }

                    this.collapse();
                });
        }

        this._router.events
            .pipe(
                filter(
                    (event): event is NavigationEnd =>
                        event instanceof NavigationEnd
                ),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((event: NavigationEnd) => {
                if (this._hasActiveChild(this.item, event.urlAfterRedirects)) {
                    this.expand();
                }
                else {
                    if (this.autoCollapse) {
                        this.collapse();
                    }
                }
            });

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

    collapse(): void {
        if (this.item.disabled) {
            return;
        }

        if (this.isCollapsed) {
            return;
        }

        this.isCollapsed = true;
        this.isExpanded = !this.isCollapsed;

        this._changeDetectorRef.markForCheck();

        this._amptrackVerticalNavigationComponent.onCollapsableItemCollapsed.next(
            this.item
        );
    }


    expand(): void {
        if (this.item.disabled) {
            return;
        }

        if (!this.isCollapsed) {
            return;
        }

        this.isCollapsed = false;
        this.isExpanded = !this.isCollapsed;

        this._changeDetectorRef.markForCheck();

        this._amptrackVerticalNavigationComponent.onCollapsableItemExpanded.next(
            this.item
        );
    }

    toggleCollapsable(): void {
        if (this.isCollapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }

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

            if (
                child.link &&
                this._router.isActive(child.link, child.exactMatch || false)
            ) {
                return true;
            }
        }

        return false;
    }

    private _isChildrenOf(
        parent: AmpTrackNavigationItem,
        item: AmpTrackNavigationItem
    ): boolean {
        const children = parent.children;

        if (!children) {
            return false;
        }

        if (children.indexOf(item) > -1) {
            return true;
        }

        for (const child of children) {
            if (child.children) {
                if (this._isChildrenOf(child, item)) {
                    return true;
                }
            }
        }

        return false;
    }
}
