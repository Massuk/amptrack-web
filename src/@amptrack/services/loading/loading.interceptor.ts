import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AmpTrackLoadingService } from '@amptrack/services/loading/loading.service';
import { Observable, finalize, take } from 'rxjs';

export const amptrackLoadingInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const amptrackLoadingService = inject(AmpTrackLoadingService);
    let handleRequestsAutomatically = false;

    amptrackLoadingService.auto$.pipe(take(1)).subscribe((value) => {
        handleRequestsAutomatically = value;
    });

    if (!handleRequestsAutomatically) {
        return next(req);
    }

    amptrackLoadingService._setLoadingStatus(true, req.url);

    return next(req).pipe(
        finalize(() => {
            amptrackLoadingService._setLoadingStatus(false, req.url);
        })
    );
};
