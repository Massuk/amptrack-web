import {
    Directive,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Directive({
    selector: '[amptrackScrollReset]',
    exportAs: 'amptrackScrollReset',
    standalone: true,
})
export class AmpTrackScrollResetDirective implements OnInit, OnDestroy {
    private _elementRef = inject(ElementRef);
    private _router = inject(Router);

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    ngOnInit(): void {
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this._elementRef.nativeElement.scrollTop = 0;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
