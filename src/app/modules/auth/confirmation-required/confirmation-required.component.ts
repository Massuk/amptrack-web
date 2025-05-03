import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { amptrackAnimations } from '@amptrack/animations';

@Component({
    selector: 'auth-confirmation-required',
    templateUrl: './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: amptrackAnimations,
    standalone: true,
    imports: [RouterLink],
})
export class AuthConfirmationRequiredComponent {
    /**
     * Constructor
     */
    constructor() {}
}
