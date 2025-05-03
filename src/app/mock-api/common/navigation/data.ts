/* eslint-disable */
import { AmpTrackNavigationItem } from '@amptrack/components/navigation';

export const defaultNavigation: AmpTrackNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Inicio',
        subtitle: 'Seguimiento de consumos',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboards.summary',
                title: 'Resumen',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/dashboards/summary',
            },
            {
                id: 'dashboards.analytics',
                title: 'Analítica',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboards/analytics',
            },
        ],
    },
    {
        id: 'divider-1',
        type: 'divider',
    },
    {
        id: 'apps',
        title: 'Utilidad',
        subtitle: 'Herramientas de AmpTrack',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'apps.history',
                title: 'Historial de observaciones',
                type: 'basic',
                icon: 'heroicons_outline:clock',
                link: '/apps/history',
            },
            {
                id: 'apps.help-center',
                title: 'Centro de ayuda',
                type: 'collapsable',
                icon: 'heroicons_outline:question-mark-circle',
                link: '/apps/help-center',
                children: [
                    {
                        id: 'apps.help-center.home',
                        title: 'Inicio',
                        type: 'basic',
                        link: '/apps/help-center',
                        exactMatch: true,
                    },
                    {
                        id: 'apps.help-center.faqs',
                        title: 'Preguntas frecuentes',
                        type: 'basic',
                        link: '/apps/help-center/faqs',
                    },
                    {
                        id: 'apps.help-center.support',
                        title: 'Contacto',
                        type: 'basic',
                        link: '/apps/help-center/support',
                    },
                ],
            },
        ],
    },
];
export const horizontalNavigation: AmpTrackNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Inicio',
        subtitle: 'Seguimiento de consumos',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboards.summary',
                title: 'Resumen',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/dashboards/summary',
            },
            {
                id: 'dashboards.analytics',
                title: 'Analítica',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboards/analytics',
            },
        ],
    },
    {
        id: 'divider-1',
        type: 'divider',
    },
    {
        id: 'apps',
        title: 'Utilidad',
        subtitle: 'Herramientas de AmpTrack',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'apps.history',
                title: 'Historial de observaciones',
                type: 'basic',
                icon: 'heroicons_outline:clock',
                link: '/apps/history',
            },
            {
                id: 'apps.help-center',
                title: 'Centro de ayuda',
                type: 'collapsable',
                icon: 'heroicons_outline:question-mark-circle',
                link: '/apps/help-center',
                children: [
                    {
                        id: 'apps.help-center.home',
                        title: 'Inicio',
                        type: 'basic',
                        link: '/apps/help-center',
                        exactMatch: true,
                    },
                    {
                        id: 'apps.help-center.faqs',
                        title: 'Preguntas frecuentes',
                        type: 'basic',
                        link: '/apps/help-center/faqs',
                    },
                    {
                        id: 'apps.help-center.support',
                        title: 'Contacto',
                        type: 'basic',
                        link: '/apps/help-center/support',
                    },
                ],
            },
        ],
    },
];
