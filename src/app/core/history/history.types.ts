export interface HistoryEntry {
    id: number;
    titulo: string;
    descripcion?: string;
    cod_empresa: string;
    razon_social: string;
    sistema_electrico: string;
    tarifa: string;
    consumo: number;
    fecha_creacion: string;
    fecha_comunicado?: string;
    comunicado_por?: string;
    creado_por: string;
    estado: number;
}

export interface HistoryCreate {
    titulo: string;
    descripcion?: string;
    cod_empresa: string;
    razon_social: string;
    sistema_electrico: string;
    tarifa: string;
    consumo: number;
    creado_por: string;
    estado?: number;
}

export interface HistoryUpdate {
    estado: number;
    comunicado_por: string;
}
