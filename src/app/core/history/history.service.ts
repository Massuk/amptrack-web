import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HistoryEntry, HistoryCreate, HistoryUpdate } from './history.types';

@Injectable({ providedIn: 'root' })
export class HistoryService {
    private _httpClient = inject(HttpClient);
    private readonly _endpoint = `${environment.apiUrl}/api/historial`;

    getAll(): Observable<HistoryEntry[]> {
        return this._httpClient.get<HistoryEntry[]>(this._endpoint);
    }

    create(entry: HistoryCreate): Observable<HistoryEntry> {
        return this._httpClient.post<HistoryEntry>(this._endpoint, entry);
    }

    update(id: number, entry: HistoryUpdate): Observable<HistoryEntry> {
        return this._httpClient.patch<HistoryEntry>(`${this._endpoint}/${id}`, entry);
    }

    delete(id: number): Observable<void> {
        return this._httpClient.delete<void>(`${this._endpoint}/${id}`);
    }
}
