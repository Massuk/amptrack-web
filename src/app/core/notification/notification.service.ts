import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, ReplaySubject, take, tap } from 'rxjs';
import { Notification, NotificationCreate, NotificationUpdate, ToggleReadStatus } from './notification.types';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private _httpClient = inject(HttpClient);
    private readonly _endpoint = `${environment.apiUrl}/api/notificaciones`;

    private _notifications$: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);

    get notifications$(): Observable<Notification[]> {
        return this._notifications$.asObservable();
    }

    loadAll(): Observable<Notification[]> {
        return this._httpClient.get<Notification[]>(this._endpoint).pipe(
            tap((notifications) => {
                this._notifications$.next(notifications);
            })
        );
    }

    getNotificationCount(): Observable<number> {
        return this._httpClient.get<number>(`${this._endpoint}/count`);
      }

    create(notification: NotificationCreate): Observable<Notification> {
        return this._httpClient.post<Notification>(this._endpoint, notification).pipe(
            tap((newNotification) => {
                this._notifications$.pipe(take(1)).subscribe((current) => {
                    this._notifications$.next([newNotification, ...current]);
                });
            })
        );
    }

    delete(id: number): Observable<void> {
        return this._httpClient.delete<void>(`${this._endpoint}/${id}`).pipe(
            tap(() => {
                this._notifications$.pipe(take(1)).subscribe((current) => {
                    this._notifications$.next(current.filter(n => n.id !== id));
                });
            })
        );
    }

    toggleReadStatus(id: number, read: boolean): Observable<Notification> {
        return this._httpClient.post<Notification>(`${this._endpoint}/toggle-read-status`, { id, read }).pipe(
            tap((updatedNotification) => {
                this._notifications$.pipe(take(1)).subscribe((current) => {
                    const updatedList = current.map((n) => (n.id === id ? { ...n, leido: read } : n));
                    this._notifications$.next(updatedList);
                });
            })
        );
    }

    markAllAsRead(): Observable<boolean> {
        return this._httpClient.get<boolean>(`${this._endpoint}/mark-all-as-read`).pipe(
            tap(() => {
                this._notifications$.pipe(take(1)).subscribe((current) => {
                    const updated = current.map((n) => ({ ...n, leido: true }));
                    this._notifications$.next(updated);
                });
            })
        );
    }
}
