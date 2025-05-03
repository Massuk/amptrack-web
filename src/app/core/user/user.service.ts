import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    set user(value: User) {
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    get(): Observable<User> {
        return this._httpClient.get<User>(`${environment.apiUrl}/api/auth/me`).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    getAll(): Observable<User[]> {
        return this._httpClient.get<User[]>(`${environment.apiUrl}/api/auth/users`);
    }
}
