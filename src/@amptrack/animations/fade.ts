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

const fadeIn = trigger('fadeIn', [
    state(
        'void',
        style({
            opacity: 0,
        })
    ),

    state(
        '*',
        style({
            opacity: 1,
        })
    ),

    transition('void => false', []),
    transition('void => *', animate('{{timings}}'), {
        params: {
            timings: `${AmpTrackAnimationDurations.entering} ${AmpTrackAnimationCurves.deceleration}`,
        },
    }),
]);

const fadeInTop = trigger('fadeInTop', [
    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(0, -100%, 0)',
        })
    ),

    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),

    transition('void => false', []),
    transition('void => *', animate('{{timings}}'), {
        params: {
            timings: `${AmpTrackAnimationDurations.entering} ${AmpTrackAnimationCurves.deceleration}`,
        },
    }),
]);

const fadeInBottom = trigger('fadeInBottom', [
    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(0, 100%, 0)',
        })
    ),

    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),
    transition('void => false', []),
    transition('void => *', animate('{{timings}}'), {
        params: {
            timings: `${AmpTrackAnimationDurations.entering} ${AmpTrackAnimationCurves.deceleration}`,
        },
    }),
]);

const fadeInLeft = trigger('fadeInLeft', [
    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(-100%, 0, 0)',
        })
    ),

    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),
    transition('void => false', []),
    transition('void => *', animate('{{timings}}'), {
        params: {
            timings: `${AmpTrackAnimationDurations.entering} ${AmpTrackAnimationCurves.deceleration}`,
        },
    }),
]);

const fadeInRight = trigger('fadeInRight', [
    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(100%, 0, 0)',
        })
    ),

    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),
    transition('void => false', []),
    transition('void => *', animate('{{timings}}'), {
        params: {
            timings: `${AmpTrackAnimationDurations.entering} ${AmpTrackAnimationCurves.deceleration}`,
        },
    }),
]);

const fadeOut = trigger('fadeOut', [
    state(
        '*',
        style({
            opacity: 1,
        })
    ),

    state(
        'void',
        style({
            opacity: 0,
        })
    ),
    transition('false => void', []),
    transition('* => void', animate('{{timings}}'), {
        params: {
            timings: `${AmpTrackAnimationDurations.exiting} ${AmpTrackAnimationCurves.acceleration}`,
        },
    }),
]);

const fadeOutTop = trigger('fadeOutTop', [
    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),

    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(0, -100%, 0)',
        })
    ),
    transition('false => void', []),
    transition('* => void', animate('{{timings}}'), {
        params: {
            timings: `${AmpTrackAnimationDurations.exiting} ${AmpTrackAnimationCurves.acceleration}`,
        },
    }),
]);

const fadeOutBottom = trigger('fadeOutBottom', [
    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),

    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(0, 100%, 0)',
        })
    ),
    transition('false => void', []),
    transition('* => void', animate('{{timings}}'), {
        params: {
            timings: `${AmpTrackAnimationDurations.exiting} ${AmpTrackAnimationCurves.acceleration}`,
        },
    }),
]);

const fadeOutLeft = trigger('fadeOutLeft', [
    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),

    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(-100%, 0, 0)',
        })
    ),
    transition('false => void', []),
    transition('* => void', animate('{{timings}}'), {
        params: {
            timings: `${AmpTrackAnimationDurations.exiting} ${AmpTrackAnimationCurves.acceleration}`,
        },
    }),
]);

const fadeOutRight = trigger('fadeOutRight', [
    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),

    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(100%, 0, 0)',
        })
    ),
    transition('false => void', []),
    transition('* => void', animate('{{timings}}'), {
        params: {
            timings: `${AmpTrackAnimationDurations.exiting} ${AmpTrackAnimationCurves.acceleration}`,
        },
    }),
]);

export {
    fadeIn,
    fadeInBottom,
    fadeInLeft,
    fadeInRight,
    fadeInTop,
    fadeOut,
    fadeOutBottom,
    fadeOutLeft,
    fadeOutRight,
    fadeOutTop,
};
