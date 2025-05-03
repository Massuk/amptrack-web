import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Supply, SupplyCompanyDetail } from './supply.types';

@Injectable({ providedIn: 'root' })
export class SupplyService {
    private _httpClient = inject(HttpClient);
    getAll(limit = 100): Observable<Supply[]> {
        return this._httpClient.get<Supply[]>(
            `${environment.apiUrl}/api/suministro?limit=${limit}`
        );
    }

    getSupplyByCode(codigo: string): Observable<Supply[]> {
        return this._httpClient.get<Supply[]>(
            `${environment.apiUrl}/api/suministro/${codigo}`
        );
    }

    getAllCount(): Observable<number> {
        return this._httpClient.get<number>(`${environment.apiUrl}/api/suministro/total`);
    }

    getEmpresasDetalle(): Observable<SupplyCompanyDetail> {
        return this._httpClient.get<SupplyCompanyDetail>(
            `${environment.apiUrl}/api/suministro/empresas/detalle`
        );
    }
}
