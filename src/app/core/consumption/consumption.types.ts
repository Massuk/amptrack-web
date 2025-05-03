export interface Tarifa {
    id: number;
    nombre: string;
}

export interface SistemaElectrico {
    id: number;
    nombre: string;
}

export interface ConsumptionDataPoint {
    month: string;
    consumption: number;
}

export interface ConsumptionSeries {
    name: string;
    data: ConsumptionDataPoint[];
}

export interface ConsumptionResponse {
    success: boolean;
    electric_system: string;
    tariff: string;
    consumptions: {
        total_data: ConsumptionSeries[];
    };
}

export interface XGBoostResponse {
    success: boolean;
    prediccion_kwh: number;
    cod_sist: string;
    anio: number;
    mes: number;
    tarifa: string;
}
