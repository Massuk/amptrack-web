import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ConsumptionService } from 'app/core/consumption/consumption.service';
import { NotificationService } from 'app/core/notification/notification.service';
import { SupplyService } from 'app/core/supply/supply.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { SummaryService } from 'app/modules/admin/dashboards/summary/summary.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Observable, Subject, map, takeUntil } from 'rxjs';

@Component({
    selector: 'summary',
    templateUrl: './summary.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatMenuModule,
        MatTabsModule,
        MatButtonToggleModule,
        NgApexchartsModule,
        MatTableModule,
        // NgClass,
        // CurrencyPipe,
    ],
})
export class SummaryComponent implements OnInit, OnDestroy {
    chartConsumosObservados: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
    user: User;
    users: User[] = [];
    data: any;
    totalCompanies$: Observable<number>;
    totalSuppliers$: Observable<number>;
    totalTariffs$: Observable<number>;
    totalNotifications$: Observable<number>;
    totalElectricSystems$: Observable<number>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _projectService: SummaryService,
        private _userService: UserService,
        private _supplyService: SupplyService,
        private _consumptionService: ConsumptionService,
        private _notificationService: NotificationService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Contador de notificaciones
        this.totalNotifications$ = this._notificationService.getNotificationCount();
        // Obtener datos del usuario
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user) => {
                this.user = user;
            });
        // Obtener todos los usuarios
        this._userService
            .getAll()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((users) => {
                this.users = users;
            });

        // Empresas
        this.totalCompanies$ = this._supplyService
            .getEmpresasDetalle()
            .pipe(map((response) => response.total_companies));

        // Suministros
        this.totalSuppliers$ = this._supplyService.getAllCount();

        // Tarifas
        this.totalTariffs$ = this._consumptionService
            .getTarifas()
            .pipe(map((response) => response.length));

        // Tarifas
        this.totalElectricSystems$ = this._consumptionService
            .getSistemasElectricos()
            .pipe(map((response) => response.length));

        // Datos de graficos
        this._projectService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;

                // Prepare the chart data
                this._prepareChartData();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Métodos públicos
    // -----------------------------------------------------------------------------------------------------

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**
     * Formatear números grandes con abreviación
     */
    formatNumber(value: number): string {
        if (value === null || value === undefined) return '...';
        if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M';
        if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';
        return value.toString();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Métodos privados
    // -----------------------------------------------------------------------------------------------------

    private _prepareChartData(): void {
        this.chartConsumosObservados = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'bar',
                stacked: true,
                toolbar: { show: false },
                zoom: { enabled: false },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '60%',
                    borderRadius: 4
                },
            },
            colors: ['#3730A3', '#166534'],
            dataLabels: {
                enabled: true,
                background: {
                    borderWidth: 0
                }
            },
            grid: {
                borderColor: 'var(--amptrack-border)',
            },
            labels: this.data.consumptionIssues.labels,
            legend: {
                position: 'top',
                horizontalAlign: 'left'
            },
            series: this.data.consumptionIssues.series,
            tooltip: {
                theme: 'dark'
            },
            xaxis: {
                type: 'category',
                categories: this.data.consumptionIssues.labels,
                labels: {
                    style: { colors: 'var(--amptrack-text-secondary)' }
                }
            },
            yaxis: {
                labels: {
                    style: { colors: 'var(--amptrack-text-secondary)' }
                }
            },
            states: {
                hover: {
                    filter: { type: 'darken', value: 0.75 }
                }
            }
        };
    }
}
