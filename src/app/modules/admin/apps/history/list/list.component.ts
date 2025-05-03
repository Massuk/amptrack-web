import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule, NgClass, PercentPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import {
    MatSlideToggleChange,
    MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AmpTrackFindByKeyPipe } from '@amptrack/pipes/find-by-key/find-by-key.pipe';
import { HistoryService } from 'app/core/history/history.service';
import { HistoryEntry } from 'app/core/history/history.types';
import { BehaviorSubject, Subject, combineLatest, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'history-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        CdkScrollable,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        NgClass,
        MatTooltipModule,
        MatProgressBarModule,
        MatButtonModule,
        RouterLink,
        AmpTrackFindByKeyPipe,
        PercentPipe,
    ],
})
export class HistoryListComponent implements OnInit, OnDestroy {
    histories: HistoryEntry[] = [];
    filteredHistories: HistoryEntry[] = [];
    companies: string[] = []; 
    loggedUser: string = '';
    
    filters: {
        companySlug$: BehaviorSubject<string>;
        query$: BehaviorSubject<string>;
        hidCommunicated$: BehaviorSubject<boolean>;
    } = {
        companySlug$: new BehaviorSubject('all'),
        query$: new BehaviorSubject(''),
        hidCommunicated$: new BehaviorSubject(false),
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _historyService: HistoryService,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._userService.get()
        .subscribe({
            next: (loggedUser) => {
                this.loggedUser = loggedUser.name
            },
            error: () => {
                this.loggedUser = null;
            },
        });

        // Obtener todo el historial
        this._historyService.getAll()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((histories: HistoryEntry[]) => {
                this.histories = this.filteredHistories = histories;

                // Obtener las empresas (razones sociales)
                this.companies = [...new Set(histories.map(entry => entry.razon_social))];

                // Refrescar vista
                this._changeDetectorRef.markForCheck();
            });

        // Filtrar los consumos
        combineLatest([
            this.filters.companySlug$,
            this.filters.query$,
            this.filters.hidCommunicated$,
        ]).subscribe(([companySlug, query, hidCommunicated]) => {
            // Resetear los consumos filtrados
            this.filteredHistories = this.histories;

            // Filtrar por empresa
            if (companySlug !== 'all') {
                this.filteredHistories = this.filteredHistories.filter(
                    (entry) => entry.razon_social === companySlug
                );
            }

            // Buscar por propiedades
            if (query !== '') {
                this.filteredHistories = this.filteredHistories.filter(
                    (entry) =>
                        entry.titulo.toLowerCase().includes(query.toLowerCase()) ||
                        entry.descripcion?.toLowerCase().includes(query.toLowerCase()) ||
                        entry.razon_social.toLowerCase().includes(query.toLowerCase()) ||
                        entry.creado_por.toLowerCase().includes(query.toLowerCase()) ||
                        entry.comunicado_por.toLowerCase().includes(query.toLowerCase())
                );
            }

            // Filtrar por consumos comunicados
            if (hidCommunicated) {
                this.filteredHistories = this.filteredHistories.filter(
                    (entry) => entry.estado === 0
                );
            }

            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Métodos públicos
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter by search query
     *
     * @param query
     */
    filterByQuery(query: string): void {
        this.filters.query$.next(query);
    }

    /**
     * Filter by company
     *
     * @param change
     */
    filterByCompany(change: MatSelectChange): void {
        this.filters.companySlug$.next(change.value);
    }

    /**
     * Show/hide communicated courses
     *
     * @param change
     */
    toggleCommunicated(change: MatSlideToggleChange): void {
        this.filters.hidCommunicated$.next(change.checked);
    }

    updateEstado(entry: HistoryEntry): void {
        const nuevoEstado = entry.estado === 0 ? 1 : 0;
    
        this._historyService.update(entry.id, {
            estado: nuevoEstado,
            comunicado_por: this.loggedUser,
        }).subscribe({
            next: (actualizado) => {
                entry.estado = actualizado.estado;
                this._changeDetectorRef.markForCheck();
            },
            error: (err) => {
            }
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
