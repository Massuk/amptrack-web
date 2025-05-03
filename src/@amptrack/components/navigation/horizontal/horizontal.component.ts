import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { amptrackAnimations } from '@amptrack/animations';
import { AmpTrackNavigationService } from '@amptrack/components/navigation/navigation.service';
import { AmpTrackNavigationItem } from '@amptrack/components/navigation/navigation.types';
import { AmpTrackUtilsService } from '@amptrack/services/utils/utils.service';
import { ReplaySubject, Subject } from 'rxjs';
import { AmpTrackHorizontalNavigationBasicItemComponent } from './components/basic/basic.component';
import { AmpTrackHorizontalNavigationBranchItemComponent } from './components/branch/branch.component';
import { AmpTrackHorizontalNavigationSpacerItemComponent } from './components/spacer/spacer.component';

@Component({
    selector: 'amptrack-horizontal-navigation',
    templateUrl: './horizontal.component.html',
    styleUrls: ['./horizontal.component.scss'],
    animations: amptrackAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'amptrackHorizontalNavigation',
    standalone: true,
    imports: [
        AmpTrackHorizontalNavigationBasicItemComponent,
        AmpTrackHorizontalNavigationBranchItemComponent,
        AmpTrackHorizontalNavigationSpacerItemComponent,
    ],
})
export class AmpTrackHorizontalNavigationComponent
    implements OnChanges, OnInit, OnDestroy
{
    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _amptrackNavigationService = inject(AmpTrackNavigationService);
    private _amptrackUtilsService = inject(AmpTrackUtilsService);

    @Input() name: string = this._amptrackUtilsService.randomId();
    @Input() navigation: AmpTrackNavigationItem[];

    onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    ngOnChanges(changes: SimpleChanges): void {
        if ('navigation' in changes) {
            this._changeDetectorRef.markForCheck();
        }
    }

    ngOnInit(): void {
        if (this.name === '') {
            this.name = this._amptrackUtilsService.randomId();
        }

        this._amptrackNavigationService.registerComponent(this.name, this);
    }

    ngOnDestroy(): void {
        this._amptrackNavigationService.deregisterComponent(this.name);
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Métodos públicos
    // -----------------------------------------------------------------------------------------------------
    refresh(): void {
        this._changeDetectorRef.markForCheck();
        this.onRefreshed.next(true);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
