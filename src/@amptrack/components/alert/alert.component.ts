import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { amptrackAnimations } from '@amptrack/animations';
import { AmpTrackAlertService } from '@amptrack/components/alert/alert.service';
import {
    AmpTrackAlertAppearance,
    AmpTrackAlertType,
} from '@amptrack/components/alert/alert.types';
import { AmpTrackUtilsService } from '@amptrack/services/utils/utils.service';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
    selector: 'amptrack-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: amptrackAnimations,
    exportAs: 'amptrackAlert',
    standalone: true,
    imports: [MatIconModule, MatButtonModule],
})
export class AmpTrackAlertComponent implements OnChanges, OnInit, OnDestroy {
    
    static ngAcceptInputType_dismissible: BooleanInput;
    static ngAcceptInputType_dismissed: BooleanInput;
    static ngAcceptInputType_showIcon: BooleanInput;
    

    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _amptrackAlertService = inject(AmpTrackAlertService);
    private _amptrackUtilsService = inject(AmpTrackUtilsService);

    @Input() appearance: AmpTrackAlertAppearance = 'soft';
    @Input() dismissed: boolean = false;
    @Input() dismissible: boolean = false;
    @Input() name: string = this._amptrackUtilsService.randomId();
    @Input() showIcon: boolean = true;
    @Input() type: AmpTrackAlertType = 'primary';
    @Output() readonly dismissedChanged: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @HostBinding('class') get classList(): any {
        
        return {
            'amptrack-alert-appearance-border': this.appearance === 'border',
            'amptrack-alert-appearance-fill': this.appearance === 'fill',
            'amptrack-alert-appearance-outline': this.appearance === 'outline',
            'amptrack-alert-appearance-soft': this.appearance === 'soft',
            'amptrack-alert-dismissed': this.dismissed,
            'amptrack-alert-dismissible': this.dismissible,
            'amptrack-alert-show-icon': this.showIcon,
            'amptrack-alert-type-primary': this.type === 'primary',
            'amptrack-alert-type-accent': this.type === 'accent',
            'amptrack-alert-type-warn': this.type === 'warn',
            'amptrack-alert-type-basic': this.type === 'basic',
            'amptrack-alert-type-info': this.type === 'info',
            'amptrack-alert-type-success': this.type === 'success',
            'amptrack-alert-type-warning': this.type === 'warning',
            'amptrack-alert-type-error': this.type === 'error',
        };
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('dismissed' in changes) {
            this.dismissed = coerceBooleanProperty(
                changes.dismissed.currentValue
            );

            this._toggleDismiss(this.dismissed);
        }

        if ('dismissible' in changes) {
            this.dismissible = coerceBooleanProperty(
                changes.dismissible.currentValue
            );
        }

        if ('showIcon' in changes) {
            this.showIcon = coerceBooleanProperty(
                changes.showIcon.currentValue
            );
        }
    }

    ngOnInit(): void {
        this._amptrackAlertService.onDismiss
            .pipe(
                filter((name) => this.name === name),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.dismiss();
            });

        this._amptrackAlertService.onShow
            .pipe(
                filter((name) => this.name === name),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.show();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    dismiss(): void {
        if (this.dismissed) {
            return;
        }

        this._toggleDismiss(true);
    }

    show(): void {
        if (!this.dismissed) {
            return;
        }

        this._toggleDismiss(false);
    }

    private _toggleDismiss(dismissed: boolean): void {
        if (!this.dismissible) {
            return;
        }

        this.dismissed = dismissed;

        this.dismissedChanged.next(this.dismissed);

        this._changeDetectorRef.markForCheck();
    }
}
