export interface Notification {
    id: number;
    icono?: string;
    titulo?: string;
    descripcion: string;
    fecha_creacion: string;
    leido: boolean;
    imagen?: string;
    enlace?: string;
    redirige: boolean;
}

export interface NotificationCreate {
    icono?: string;
    titulo?: string;
    descripcion: string;
    leido?: boolean;
    imagen?: string;
    enlace?: string;
    redirige?: boolean;
}

export interface NotificationUpdate {
    icono?: string;
    titulo?: string;
    descripcion?: string;
    leido?: boolean;
    imagen?: string;
    enlace?: string;
    redirige?: boolean;
}

export interface ToggleReadStatus {
    id: number;
    leido: boolean;
}
