import {
    animate,
    AnimationBuilder,
    AnimationPlayer,
    style,
} from '@angular/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { AmpTrackDrawerService } from '@amptrack/components/drawer/drawer.service';
import {
    AmpTrackDrawerMode,
    AmpTrackDrawerPosition,
} from '@amptrack/components/drawer/drawer.types';
import { AmpTrackUtilsService } from '@amptrack/services/utils/utils.service';

@Component({
    selector: 'amptrack-drawer',
    templateUrl: './drawer.component.html',
    styleUrls: ['./drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    exportAs: 'amptrackDrawer',
    standalone: true,
})
export class AmpTrackDrawerComponent implements OnChanges, OnInit, OnDestroy {
    
    static ngAcceptInputType_fixed: BooleanInput;
    static ngAcceptInputType_opened: BooleanInput;
    static ngAcceptInputType_transparentOverlay: BooleanInput;
    

    private _animationBuilder = inject(AnimationBuilder);
    private _elementRef = inject(ElementRef);
    private _renderer2 = inject(Renderer2);
    private _amptrackDrawerService = inject(AmpTrackDrawerService);
    private _amptrackUtilsService = inject(AmpTrackUtilsService);

    @Input() fixed: boolean = false;
    @Input() mode: AmpTrackDrawerMode = 'side';
    @Input() name: string = this._amptrackUtilsService.randomId();
    @Input() opened: boolean = false;
    @Input() position: AmpTrackDrawerPosition = 'left';
    @Input() transparentOverlay: boolean = false;
    @Output() readonly fixedChanged: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    @Output() readonly modeChanged: EventEmitter<AmpTrackDrawerMode> =
        new EventEmitter<AmpTrackDrawerMode>();
    @Output() readonly openedChanged: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    @Output() readonly positionChanged: EventEmitter<AmpTrackDrawerPosition> =
        new EventEmitter<AmpTrackDrawerPosition>();

    private _animationsEnabled: boolean = false;
    private readonly _handleOverlayClick = (): void => this.close();
    private _hovered: boolean = false;
    private _overlay: HTMLElement;
    private _player: AnimationPlayer;

    @HostBinding('class') get classList(): any {
        
        return {
            'amptrack-drawer-animations-enabled': this._animationsEnabled,
            'amptrack-drawer-fixed': this.fixed,
            'amptrack-drawer-hover': this._hovered,
            [`amptrack-drawer-mode-${this.mode}`]: true,
            'amptrack-drawer-opened': this.opened,
            [`amptrack-drawer-position-${this.position}`]: true,
        };
        
    }

    @HostBinding('style') get styleList(): any {
        return {
            visibility: this.opened ? 'visible' : 'hidden',
        };
    }

    @HostListener('mouseenter')
    private _onMouseenter(): void {
        this._enableAnimations();

        this._hovered = true;
    }


    @HostListener('mouseleave')
    private _onMouseleave(): void {
        this._enableAnimations();

        this._hovered = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('fixed' in changes) {
            this.fixed = coerceBooleanProperty(changes.fixed.currentValue);

            this.fixedChanged.next(this.fixed);
        }

        if ('mode' in changes) {
            const previousMode = changes.mode.previousValue;
            const currentMode = changes.mode.currentValue;

            this._disableAnimations();

            if (previousMode === 'over' && currentMode === 'side') {
                this._hideOverlay();
            }

            if (previousMode === 'side' && currentMode === 'over') {
                if (this.opened) {
                    this._showOverlay();
                }
            }

            this.modeChanged.next(currentMode);

            setTimeout(() => {
                this._enableAnimations();
            }, 500);
        }

        if ('opened' in changes) {
            const open = coerceBooleanProperty(changes.opened.currentValue);

            this._toggleOpened(open);
        }

        if ('position' in changes) {
            this.positionChanged.next(this.position);
        }

        if ('transparentOverlay' in changes) {
            this.transparentOverlay = coerceBooleanProperty(
                changes.transparentOverlay.currentValue
            );
        }
    }

    ngOnInit(): void {
        this._amptrackDrawerService.registerComponent(this.name, this);
    }

    ngOnDestroy(): void {
        if (this._player) {
            this._player.finish();
        }

        this._amptrackDrawerService.deregisterComponent(this.name);
    }

    open(): void {
        if (this.opened) {
            return;
        }
        this._toggleOpened(true);
    }

    close(): void {
        if (!this.opened) {
            return;
        }

        this._toggleOpened(false);
    }

    toggle(): void {
        if (this.opened) {
            this.close();
        } else {
            this.open();
        }
    }

    private _enableAnimations(): void {
        if (this._animationsEnabled) {
            return;
        }

        this._animationsEnabled = true;
    }

    private _disableAnimations(): void {
        if (!this._animationsEnabled) {
            return;
        }

        this._animationsEnabled = false;
    }

    private _showOverlay(): void {
        this._overlay = this._renderer2.createElement('div');

        this._overlay.classList.add('amptrack-drawer-overlay');

        if (this.fixed) {
            this._overlay.classList.add('amptrack-drawer-overlay-fixed');
        }

        if (this.transparentOverlay) {
            this._overlay.classList.add('amptrack-drawer-overlay-transparent');
        }

        this._renderer2.appendChild(
            this._elementRef.nativeElement.parentElement,
            this._overlay
        );

        this._player = this._animationBuilder
            .build([
                style({ opacity: 0 }),
                animate(
                    '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                    style({ opacity: 1 })
                ),
            ])
            .create(this._overlay);

        this._player.play();

        this._overlay.addEventListener('click', this._handleOverlayClick);
    }

    private _hideOverlay(): void {
        if (!this._overlay) {
            return;
        }

        this._player = this._animationBuilder
            .build([
                animate(
                    '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                    style({ opacity: 0 })
                ),
            ])
            .create(this._overlay);

        this._player.play();

        this._player.onDone(() => {
            if (this._overlay) {
                this._overlay.removeEventListener(
                    'click',
                    this._handleOverlayClick
                );

                this._overlay.parentNode.removeChild(this._overlay);
                this._overlay = null;
            }
        });
    }

    private _toggleOpened(open: boolean): void {
        this.opened = open;

        this._enableAnimations();

        if (this.mode === 'over') {
            if (open) {
                this._showOverlay();
            }
            else {
                this._hideOverlay();
            }
        }

        this.openedChanged.next(open);
    }
}
