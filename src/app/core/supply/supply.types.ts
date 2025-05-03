export interface Supply {
    id: number;
    cod?: string;
    cod_pc?: string;
    estado?: string;
    fecha_ps?: string;
    fecha_ret?: string;
    x?: number;
    y?: number;
    sector?: string;
    cod_sist?: string;
    nom_sist?: string;
    alim?: string;
    sed?: string;
    empresa?: string;
    razon_social?: string;
}

export interface SupplyCompanyDetail {
    total_companies: number;
    companies: string[];
}
