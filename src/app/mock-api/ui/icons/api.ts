import { Injectable } from '@angular/core';
import { AmpTrackMockApiService } from '@amptrack/lib/mock-api';
import { feather, heroicons, material } from 'app/mock-api/ui/icons/data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class IconsMockApi {
    private readonly _feather: any = feather;
    private readonly _heroicons: any = heroicons;
    private readonly _material: any = material;

    constructor(private _amptrackMockApiService: AmpTrackMockApiService) {
        this.registerHandlers();
    }
    registerHandlers(): void {
        this._amptrackMockApiService.onGet('api/ui/icons/feather').reply(() => [
            200,
            {
                namespace: 'feather',
                name: 'Feather',
                grid: 'icon-size-6',
                list: cloneDeep(this._feather),
            },
        ]);

        this._amptrackMockApiService
            .onGet('api/ui/icons/heroicons-outline')
            .reply(() => [
                200,
                {
                    namespace: 'heroicons_outline',
                    name: 'Heroicons Outline',
                    grid: 'icon-size-6',
                    list: cloneDeep(this._heroicons),
                },
            ]);

        this._amptrackMockApiService
            .onGet('api/ui/icons/heroicons-solid')
            .reply(() => [
                200,
                {
                    namespace: 'heroicons_solid',
                    name: 'Heroicons Solid',
                    grid: 'icon-size-6',
                    list: cloneDeep(this._heroicons),
                },
            ]);

        this._amptrackMockApiService
            .onGet('api/ui/icons/heroicons-mini')
            .reply(() => [
                200,
                {
                    namespace: 'heroicons_mini',
                    name: 'Heroicons Mini',
                    grid: 'icon-size-5',
                    list: cloneDeep(this._heroicons),
                },
            ]);

        this._amptrackMockApiService
            .onGet('api/ui/icons/material-solid')
            .reply(() => [
                200,
                {
                    namespace: 'mat_solid',
                    name: 'Material Solid',
                    grid: 'icon-size-6',
                    list: cloneDeep(this._material),
                },
            ]);

        this._amptrackMockApiService
            .onGet('api/ui/icons/material-outline')
            .reply(() => [
                200,
                {
                    namespace: 'mat_outline',
                    name: 'Material Outline',
                    grid: 'icon-size-6',
                    list: cloneDeep(this._material),
                },
            ]);

        this._amptrackMockApiService
            .onGet('api/ui/icons/material-twotone')
            .reply(() => [
                200,
                {
                    namespace: '',
                    name: 'Material Twotone',
                    grid: 'icon-size-6',
                    list: cloneDeep(this._material),
                },
            ]);
    }
}
