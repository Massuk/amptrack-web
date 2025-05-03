import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { AmpTrackConfigService } from '@amptrack/services/config';
import { fromPairs } from 'lodash-es';
import { Observable, ReplaySubject, map, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AmpTrackMediaWatcherService {
    private _breakpointObserver = inject(BreakpointObserver);
    private _amptrackConfigService = inject(AmpTrackConfigService);

    private _onMediaChange: ReplaySubject<{
        matchingAliases: string[];
        matchingQueries: any;
    }> = new ReplaySubject<{ matchingAliases: string[]; matchingQueries: any }>(
        1
    );

    constructor() {
        this._amptrackConfigService.config$
            .pipe(
                map((config) =>
                    fromPairs(
                        Object.entries(config.screens).map(
                            ([alias, screen]) => [
                                alias,
                                `(min-width: ${screen})`,
                            ]
                        )
                    )
                ),
                switchMap((screens) =>
                    this._breakpointObserver
                        .observe(Object.values(screens))
                        .pipe(
                            map((state) => {
                                const matchingAliases: string[] = [];
                                const matchingQueries: any = {};

                                const matchingBreakpoints =
                                    Object.entries(state.breakpoints).filter(
                                        ([query, matches]) => matches
                                    ) ?? [];
                                for (const [query] of matchingBreakpoints) {
                                    const matchingAlias = Object.entries(
                                        screens
                                    ).find(([alias, q]) => q === query)[0];

                                    if (matchingAlias) {
                                        matchingAliases.push(matchingAlias);
                                        matchingQueries[matchingAlias] = query;
                                    }
                                }

                                this._onMediaChange.next({
                                    matchingAliases,
                                    matchingQueries,
                                });
                            })
                        )
                )
            )
            .subscribe();
    }

    get onMediaChange$(): Observable<{
        matchingAliases: string[];
        matchingQueries: any;
    }> {
        return this._onMediaChange.asObservable();
    }

    onMediaQueryChange$(query: string | string[]): Observable<BreakpointState> {
        return this._breakpointObserver.observe(query);
    }
}
