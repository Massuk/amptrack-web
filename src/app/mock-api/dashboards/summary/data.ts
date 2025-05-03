import { DateTime } from 'luxon';

const now = DateTime.now();

export const summary = {
    consumptionIssues: {
        overview: {
            'this-week': {
                'new-issues': 214,
                'closed-issues': 75,
            },
            'last-week': {
                'new-issues': 197,
                'closed-issues': 72,
            },
        },
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series: {
            'this-week': [
                {
                    name: 'Observados',
                    data: [42, 28, 43, 34, 20, 25, 22],
                },
                {
                    name: 'Comunicados',
                    data: [11, 10, 8, 11, 8, 10, 17],
                },
            ],
            'last-week': [
                {
                    name: 'Observados',
                    data: [37, 32, 39, 27, 18, 24, 20],
                },
                {
                    name: 'Comunicados',
                    data: [9, 8, 10, 12, 7, 11, 15],
                },
            ],
        },
    },
};
