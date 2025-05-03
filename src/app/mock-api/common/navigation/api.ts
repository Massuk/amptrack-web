import { Injectable } from '@angular/core';
import { AmpTrackNavigationItem } from '@amptrack/components/navigation';
import { AmpTrackMockApiService } from '@amptrack/lib/mock-api';
import {
    defaultNavigation,
    horizontalNavigation,
} from 'app/mock-api/common/navigation/data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class NavigationMockApi {
    private readonly _defaultNavigation: AmpTrackNavigationItem[] =
        defaultNavigation;

    private readonly _horizontalNavigation: AmpTrackNavigationItem[] =
        horizontalNavigation;

    constructor(private _amptrackMockApiService: AmpTrackMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {
        this._amptrackMockApiService.onGet('api/common/navigation').reply(() => {
            this._horizontalNavigation.forEach((horizontalNavItem) => {
                this._defaultNavigation.forEach((defaultNavItem) => {
                    if (defaultNavItem.id === horizontalNavItem.id) {
                        horizontalNavItem.children = cloneDeep(
                            defaultNavItem.children
                        );
                    }
                });
            });

            return [
                200,
                {
                    default: cloneDeep(this._defaultNavigation),
                    horizontal: cloneDeep(this._horizontalNavigation),
                },
            ];
        });
    }
}
