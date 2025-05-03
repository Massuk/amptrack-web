import { HttpRequest } from '@angular/common/http';
import { AmpTrackMockApiReplyCallback } from '@amptrack/lib/mock-api/mock-api.types';
import { Observable, of, take, throwError } from 'rxjs';

export class AmpTrackMockApiHandler {
    request!: HttpRequest<any>;
    urlParams!: { [key: string]: string };

    private _reply: AmpTrackMockApiReplyCallback = undefined;
    private _replyCount = 0;
    private _replied = 0;

    constructor(
        public url: string,
        public delay?: number
    ) {}

    get response(): Observable<any> {
        if (this._replyCount > 0 && this._replyCount <= this._replied) {
            return throwError('Execution limit has been reached!');
        }

        if (!this._reply) {
            return throwError('Response callback function does not exist!');
        }

        if (!this.request) {
            return throwError('Request does not exist!');
        }

        this._replied++;

        const replyResult = this._reply({
            request: this.request,
            urlParams: this.urlParams,
        });

        if (replyResult instanceof Observable) {
            return replyResult.pipe(take(1));
        }

        return of(replyResult).pipe(take(1));
    }

    reply(callback: AmpTrackMockApiReplyCallback): void {
        this._reply = callback;
    }

    replyCount(count: number): void {
        this._replyCount = count;
    }
}
