import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    PreloadAllModules,
    provideRouter,
    withInMemoryScrolling,
    withPreloading,
} from '@angular/router';
import { provideAmpTrack } from '@amptrack';
import { appRoutes } from 'app/app.routes';
import { provideAuth } from 'app/core/auth/auth.provider';
import { provideIcons } from 'app/core/icons/icons.provider';
import { mockApiServices } from 'app/mock-api';
import { firstValueFrom } from 'rxjs';
import { LOCALE_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideHttpClient(),
        provideRouter(
            appRoutes,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
        ),
        { provide: LOCALE_ID, useValue: 'es' },

        {
            provide: DateAdapter,
            useClass: LuxonDateAdapter,
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'D',
                },
                display: {
                    dateInput: 'DDD',
                    monthYearLabel: 'LLL yyyy',
                    dateA11yLabel: 'DD',
                    monthYearA11yLabel: 'LLLL yyyy',
                },
            },
        },

        // AmpTrack
        provideAuth(),
        provideIcons(),
        provideAmpTrack({
            mockApi: {
                delay: 0,
                services: mockApiServices,
            },
            amptrack: {
                layout: 'classy', // Aqui seleccionar tipo de vista
                scheme: 'light',
                screens: {
                    sm: '600px',
                    md: '960px',
                    lg: '1280px',
                    xl: '1440px',
                },
                theme: 'theme-default',
                themes: [
                    {
                        id: 'theme-default',
                        name: 'Defecto',
                    },
                    {
                        id: 'theme-brand',
                        name: 'Celeste',
                    },
                    {
                        id: 'theme-teal',
                        name: 'Verde',
                    },
                    {
                        id: 'theme-rose',
                        name: 'Rosa',
                    },
                    {
                        id: 'theme-purple',
                        name: 'Púrpura',
                    },
                    {
                        id: 'theme-amber',
                        name: 'Ámbar',
                    },
                ],
            },
        }),
    ],
};
