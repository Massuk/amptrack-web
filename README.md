![amptrack-logo](https://i.ibb.co/h1h7mgj9/amptrack-logo.png)

---

## Sobre el proyecto

**AmpTrack** es la interfaz web desarrollada en **Angular** para visualizar y gestionar las predicciones de **pérdidas no técnicas de energía eléctrica**, como fraudes, conexiones ilegales o manipulación de medidores. Este módulo consume un API REST que expone los resultados generados por dos modelos de _Machine Learning_ entrenado con datos históricos extraídos de Osinergmin (Plataforma Nacional de Datos Abiertos).

## Funcionalidades Principales

- Visualización de predicciones por suministro.
- Dashboard con datos de consumos e información de suministro.
- Historial de inspecciones y comportamiento del consumo.
- Filtros por fecha, nivel de riesgo y ubicación.
- Sección de ayuda con guías y formulario de contacto hacia el desarrollador.
- Modo oscuro

## Tecnologías Utilizadas

- [Angular 18](https://angular.io/ "‌")
- TypeScript
- RxJS
- Angular Material
- ApexCharts
- SCSS

## Estructura del Proyecto

```plaintext
src/
├── app/
│   ├── components/       # Componentes reutilizables
│   ├── pages/            # Vistas principales (dashboard, detalles, mapa)
│   ├── services/         # Lógica de conexión con API
│   ├── models/           # Interfaces y tipos de datos
│   └── app-routing.module.ts
├── assets/
│   └── icons, logos, configuración estática
└── environments/
    └── environment.ts    # Configuración de entorno (API, producción, etc.)
```

## Instalación y Ejecución

Clona el repositorio:

```bash
git clone <https://github.com/tu-usuario/amptrack-frontend.git>
cd amptrack-frontend
```

Instala las dependencias:

```bash
npm install
```

Ejecuta la aplicación en modo desarrollo

```bash
ng serve
```

## Configuración del Backend

```bash
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: '<http://localhost:8000/api'>
};
```

## Equipo

Desarrollo

- Miguel Flores [\@‌massuk](https://www.github.com/massuk "‌")

Documentación

- Dayanna Pérez

## Licencia

Este proyecto está disponible bajo los términos de la licencia [BSD 3-Clause](LICENSE "‌").