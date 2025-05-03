import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AmpTrackSplashScreenService {
    private _document = inject(DOCUMENT);
    private _router = inject(Router);

    constructor() {
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                this.hide();
            });
    }

    show(): void {
        this._document.body.classList.remove('amptrack-splash-screen-hidden');
    }

    hide(): void {
        this._document.body.classList.add('amptrack-splash-screen-hidden');
    }
}
