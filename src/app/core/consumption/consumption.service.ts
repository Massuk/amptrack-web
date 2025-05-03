import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { SistemaElectrico, Tarifa, ConsumptionResponse, XGBoostResponse } from './consumption.types';

@Injectable({ providedIn: 'root' })
export class ConsumptionService {
    private _httpClient = inject(HttpClient);

    getTarifas(): Observable<Tarifa[]> {
        return this._httpClient.get<Tarifa[]>(
            `${environment.apiUrl}/api/consumos/tarifas/residencial`
        );
    }

    getSistemasElectricos(): Observable<SistemaElectrico[]> {
        return this._httpClient.get<SistemaElectrico[]>(
            `${environment.apiUrl}/api/consumos/sistemas/residencial`
        );
    }

    getArimaPredict(cod_sist: string, tarifa: string): Observable<ConsumptionResponse> {
        return this._httpClient.get<ConsumptionResponse>(
            `${environment.apiUrl}/api/consumos/arima`,
            {
                params: {
                    cod_sist,
                    tarifa,
                },
            }
        );
    }

    getXGBoostPredict(cod_sist: string, anio: number, mes: number, tarifa: string): Observable<XGBoostResponse> {
        return this._httpClient.get<XGBoostResponse>(
            `${environment.apiUrl}/api/consumos/xgboost`,
            {
                params: {
                    cod_sist,
                    anio,
                    mes,
                    tarifa,
                },
            }
        );
    }
    
}
