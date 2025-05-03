import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

import {
    Component,
    HostBinding,
    Input,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { amptrackAnimations } from '@amptrack/animations';
import { AmpTrackCardFace } from '@amptrack/components/card/card.types';

@Component({
    selector: 'amptrack-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: amptrackAnimations,
    exportAs: 'amptrackCard',
    standalone: true,
    imports: [],
})
export class AmpTrackCardComponent implements OnChanges {
    
    static ngAcceptInputType_expanded: BooleanInput;
    static ngAcceptInputType_flippable: BooleanInput;
    

    @Input() expanded: boolean = false;
    @Input() face: AmpTrackCardFace = 'front';
    @Input() flippable: boolean = false;

    @HostBinding('class') get classList(): any {
        
        return {
            'amptrack-card-expanded': this.expanded,
            'amptrack-card-face-back': this.flippable && this.face === 'back',
            'amptrack-card-face-front': this.flippable && this.face === 'front',
            'amptrack-card-flippable': this.flippable,
        };
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('expanded' in changes) {
            this.expanded = coerceBooleanProperty(
                changes.expanded.currentValue
            );
        }

        if ('flippable' in changes) {
            this.flippable = coerceBooleanProperty(
                changes.flippable.currentValue
            );
        }
    }
}
