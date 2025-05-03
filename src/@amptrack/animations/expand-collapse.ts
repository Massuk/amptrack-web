import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {
    AmpTrackAnimationCurves,
    AmpTrackAnimationDurations,
} from '@amptrack/animations/defaults';

const expandCollapse = trigger('expandCollapse', [
    state(
        'void, collapsed',
        style({
            height: '0',
        })
    ),

    state('*, expanded', style('*')),

    transition('void <=> false, collapsed <=> false, expanded <=> false', []),

    transition('void <=> *, collapsed <=> expanded', animate('{{timings}}'), {
        params: {
            timings: `${AmpTrackAnimationDurations.entering} ${AmpTrackAnimationCurves.deceleration}`,
        },
    }),
]);

export { expandCollapse };
