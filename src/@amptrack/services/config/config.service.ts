import { inject, Injectable } from '@angular/core';
import { AMPTRACK_CONFIG } from '@amptrack/services/config/config.constants';
import { merge } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AmpTrackConfigService {
    private _config = new BehaviorSubject(inject(AMPTRACK_CONFIG));

    set config(value: any) {
        const config = merge({}, this._config.getValue(), value);

        this._config.next(config);
    }

    get config$(): Observable<any> {
        return this._config.asObservable();
    }

    reset(): void {
        this._config.next(this.config);
    }
}
