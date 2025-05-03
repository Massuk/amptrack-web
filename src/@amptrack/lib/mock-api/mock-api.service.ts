import { Injectable } from '@angular/core';
import { AmpTrackMockApiHandler } from '@amptrack/lib/mock-api/mock-api.request-handler';
import { AmpTrackMockApiMethods } from '@amptrack/lib/mock-api/mock-api.types';
import { compact, fromPairs } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class AmpTrackMockApiService {
    private _handlers: { [key: string]: Map<string, AmpTrackMockApiHandler> } = {
        get: new Map<string, AmpTrackMockApiHandler>(),
        post: new Map<string, AmpTrackMockApiHandler>(),
        patch: new Map<string, AmpTrackMockApiHandler>(),
        delete: new Map<string, AmpTrackMockApiHandler>(),
        put: new Map<string, AmpTrackMockApiHandler>(),
        head: new Map<string, AmpTrackMockApiHandler>(),
        jsonp: new Map<string, AmpTrackMockApiHandler>(),
        options: new Map<string, AmpTrackMockApiHandler>(),
    };

    findHandler(
        method: string,
        url: string
    ): {
        handler: AmpTrackMockApiHandler | undefined;
        urlParams: { [key: string]: string };
    } {
        const matchingHandler: {
            handler: AmpTrackMockApiHandler | undefined;
            urlParams: { [key: string]: string };
        } = {
            handler: undefined,
            urlParams: {},
        };

        const urlParts = url.split('/');
        const handlers = this._handlers[method.toLowerCase()];
        handlers.forEach((handler, handlerUrl) => {
            if (matchingHandler.handler) {
                return;
            }

            const handlerUrlParts = handlerUrl.split('/');

            if (urlParts.length !== handlerUrlParts.length) {
                return;
            }

            const matches = handlerUrlParts.every(
                (handlerUrlPart, index) =>
                    handlerUrlPart === urlParts[index] ||
                    handlerUrlPart.startsWith(':')
            );

            if (matches) {
                matchingHandler.handler = handler;

                matchingHandler.urlParams = fromPairs(
                    compact(
                        handlerUrlParts.map((handlerUrlPart, index) =>
                            handlerUrlPart.startsWith(':')
                                ? [handlerUrlPart.substring(1), urlParts[index]]
                                : undefined
                        )
                    )
                );
            }
        });

        return matchingHandler;
    }

    onGet(url: string, delay?: number): AmpTrackMockApiHandler {
        return this._registerHandler('get', url, delay);
    }

    onPost(url: string, delay?: number): AmpTrackMockApiHandler {
        return this._registerHandler('post', url, delay);
    }

    onPatch(url: string, delay?: number): AmpTrackMockApiHandler {
        return this._registerHandler('patch', url, delay);
    }

    onDelete(url: string, delay?: number): AmpTrackMockApiHandler {
        return this._registerHandler('delete', url, delay);
    }

    onPut(url: string, delay?: number): AmpTrackMockApiHandler {
        return this._registerHandler('put', url, delay);
    }

    onHead(url: string, delay?: number): AmpTrackMockApiHandler {
        return this._registerHandler('head', url, delay);
    }

    onJsonp(url: string, delay?: number): AmpTrackMockApiHandler {
        return this._registerHandler('jsonp', url, delay);
    }

    onOptions(url: string, delay?: number): AmpTrackMockApiHandler {
        return this._registerHandler('options', url, delay);
    }

    private _registerHandler(
        method: AmpTrackMockApiMethods,
        url: string,
        delay?: number
    ): AmpTrackMockApiHandler {
        const amptrackMockHttp = new AmpTrackMockApiHandler(url, delay);

        this._handlers[method].set(url, amptrackMockHttp);

        return amptrackMockHttp;
    }
}
