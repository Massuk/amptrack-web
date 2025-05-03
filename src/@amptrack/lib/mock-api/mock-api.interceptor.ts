import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AMPTRACK_MOCK_API_DEFAULT_DELAY } from '@amptrack/lib/mock-api/mock-api.constants';
import { AmpTrackMockApiService } from '@amptrack/lib/mock-api/mock-api.service';
import { Observable, delay, of, switchMap, throwError } from 'rxjs';

export const mockApiInterceptor = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const defaultDelay = inject(AMPTRACK_MOCK_API_DEFAULT_DELAY);
    const amptrackMockApiService = inject(AmpTrackMockApiService);

    const { handler, urlParams } = amptrackMockApiService.findHandler(
        request.method.toUpperCase(),
        request.url
    );

    if (!handler) {
        return next(request);
    }

    handler.request = request;

    handler.urlParams = urlParams;

    return handler.response.pipe(
        delay(handler.delay ?? defaultDelay ?? 0),
        switchMap((response) => {
            if (!response) {
                response = new HttpErrorResponse({
                    error: 'NOT FOUND',
                    status: 404,
                    statusText: 'NOT FOUND',
                });

                return throwError(response);
            }

            const data = {
                status: response[0],
                body: response[1],
            };

            if (data.status >= 200 && data.status < 300) {
                response = new HttpResponse({
                    body: data.body,
                    status: data.status,
                    statusText: 'OK',
                });

                return of(response);
            }

            response = new HttpErrorResponse({
                error: data.body.error,
                status: data.status,
                statusText: 'ERROR',
            });

            return throwError(response);
        })
    );
};
