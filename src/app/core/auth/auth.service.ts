import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/api/auth/forgot-password`, email);
    }

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/api/auth/reset-password`, password);
    }

    signIn(credentials: { email: string; password: string }): Observable<any> {
        if (this._authenticated) {
            return throwError(() => new Error('El usuario ya ha iniciado sesión.'));
        }

        return this._httpClient.post(`${environment.apiUrl}/api/auth/sign-in`, credentials).pipe(
            switchMap((response: any) => {
                this.accessToken = response.accessToken;
                this._authenticated = true;
                this._userService.user = response.user;
                return of(response);
            })
        );
    }

    signInUsingToken(): Observable<any> {
        return this._httpClient
            .get(`${environment.apiUrl}/api/auth/me`)
            .pipe(
                catchError(() => of(false)),
                switchMap((response: any) => {
                    this._authenticated = true;
                    this._userService.user = response;
                    return of(true);
                })
            );
    }

    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');
        this._authenticated = false;
        return of(true);
    }

    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/api/auth/sign-up`, user);
    }

    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/api/auth/unlock-session`, credentials);
    }

    check(): Observable<boolean> {
        if (this._authenticated) return of(true);
        if (!this.accessToken) return of(false);
        if (AuthUtils.isTokenExpired(this.accessToken)) return of(false);
        return this.signInUsingToken();
    }
}
