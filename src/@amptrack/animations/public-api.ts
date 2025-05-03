import { expandCollapse } from '@amptrack/animations/expand-collapse';
import {
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
} from '@amptrack/animations/fade';
import { shake } from '@amptrack/animations/shake';
import {
    slideInBottom,
    slideInLeft,
    slideInRight,
    slideInTop,
    slideOutBottom,
    slideOutLeft,
    slideOutRight,
    slideOutTop,
} from '@amptrack/animations/slide';
import { zoomIn, zoomOut } from '@amptrack/animations/zoom';

export const amptrackAnimations = [
    expandCollapse,
    fadeIn,
    fadeInTop,
    fadeInBottom,
    fadeInLeft,
    fadeInRight,
    fadeOut,
    fadeOutTop,
    fadeOutBottom,
    fadeOutLeft,
    fadeOutRight,
    shake,
    slideInTop,
    slideInBottom,
    slideInLeft,
    slideInRight,
    slideOutTop,
    slideOutBottom,
    slideOutLeft,
    slideOutRight,
    zoomIn,
    zoomOut,
];
