import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    APP_INITIALIZER,
    ENVIRONMENT_INITIALIZER,
    EnvironmentProviders,
    Provider,
    importProvidersFrom,
    inject,
} from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
    AMPTRACK_MOCK_API_DEFAULT_DELAY,
    mockApiInterceptor,
} from '@amptrack/lib/mock-api';
import { AmpTrackConfig } from '@amptrack/services/config';
import { AMPTRACK_CONFIG } from '@amptrack/services/config/config.constants';
import { AmpTrackConfirmationService } from '@amptrack/services/confirmation';
import {
    AmpTrackLoadingService,
    amptrackLoadingInterceptor,
} from '@amptrack/services/loading';
import { AmpTrackMediaWatcherService } from '@amptrack/services/media-watcher';
import { AmpTrackPlatformService } from '@amptrack/services/platform';
import { AmpTrackSplashScreenService } from '@amptrack/services/splash-screen';
import { AmpTrackUtilsService } from '@amptrack/services/utils';

export type AmpTrackProviderConfig = {
    mockApi?: {
        delay?: number;
        services?: any[];
    };
    amptrack?: AmpTrackConfig;
};

export const provideAmpTrack = (
    config: AmpTrackProviderConfig
): Array<Provider | EnvironmentProviders> => {
    const providers: Array<Provider | EnvironmentProviders> = [
        {

            provide: MATERIAL_SANITY_CHECKS,
            useValue: {
                doctype: true,
                theme: false,
                version: true,
            },
        },
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill',
            },
        },
        {
            provide: AMPTRACK_MOCK_API_DEFAULT_DELAY,
            useValue: config?.mockApi?.delay ?? 0,
        },
        {
            provide: AMPTRACK_CONFIG,
            useValue: config?.amptrack ?? {},
        },

        importProvidersFrom(MatDialogModule),
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(AmpTrackConfirmationService),
            multi: true,
        },

        provideHttpClient(withInterceptors([amptrackLoadingInterceptor])),
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(AmpTrackLoadingService),
            multi: true,
        },

        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(AmpTrackMediaWatcherService),
            multi: true,
        },
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(AmpTrackPlatformService),
            multi: true,
        },
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(AmpTrackSplashScreenService),
            multi: true,
        },
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(AmpTrackUtilsService),
            multi: true,
        },
    ];

    if (config?.mockApi?.services) {
        providers.push(
            provideHttpClient(withInterceptors([mockApiInterceptor])),
            {
                provide: APP_INITIALIZER,
                deps: [...config.mockApi.services],
                useFactory: () => (): any => null,
                multi: true,
            }
        );
    }

    return providers;
};
