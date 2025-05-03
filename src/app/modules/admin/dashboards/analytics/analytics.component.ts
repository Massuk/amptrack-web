import { AmpTrackConfirmationService } from '@amptrack/services/confirmation';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ConsumptionService } from 'app/core/consumption/consumption.service';
import { HistoryService } from 'app/core/history/history.service';
import { HistoryCreate } from 'app/core/history/history.types';
import { NotificationService } from 'app/core/notification/notification.service';
import { Notification, NotificationCreate } from 'app/core/notification/notification.types';
import { SupplyService } from 'app/core/supply/supply.service';
import { Supply } from 'app/core/supply/supply.types';
import { UserService } from 'app/core/user/user.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'analytics',
    templateUrl: './analytics.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDividerModule,
        MatButtonToggleModule,
        NgApexchartsModule,
        MatTooltipModule,
        DecimalPipe,
    ],
})
export class AnalyticsComponent implements OnInit, OnDestroy {
    chartConsumptions: ApexOptions;
    queryDate: Date | null = null;
    selectedTariff: string = 'De 1 a 30 kW.h';
    selectedSystem: string = '';
    loggedUser: string = '';
    predictedConsumptionXGB: number | null = null;
    data: any;

    codigoSuministro: string = '';
    supplies: Supply[] = [];
    selectedSupply: Supply | null = null;

    // Test
    fechaSeleccionada: string = '';
    fechaPredicha: boolean = false;
    showError: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _amptrackConfirmationService: AmpTrackConfirmationService,
        private _notificationService: NotificationService,
        private _userService: UserService,
        private _consumptionsService: ConsumptionService,
        private _supplyService: SupplyService,
        private _historyService: HistoryService,
        private _router: Router,
        private _cdr: ChangeDetectorRef
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

        const storedSupply = localStorage.getItem('selectedSupply');
        if (storedSupply) {
            this.selectedSupply = JSON.parse(storedSupply);
            this.selectedSystem = this.selectedSupply.cod_sist ?? '';
            this.selectedTariff;

            this.queryDate = new Date();

            this._consumptionsService
                .getArimaPredict(this.selectedSystem, this.selectedTariff)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe({
                    next: (data) => {
                        this.data = data;
                        this._prepareChartData();
                    },
                    error: () => {
                        this.data = null;
                    },
                });
        }
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
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Métodos privados
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void {
        const adaptedSeries = this.data.consumptions.total_data.map((serie: any) => ({
            name: serie.name,
            data: serie.data.map((p: any) => ({
                x: p.month,
                y: p.consumption,
            })),
        }));

        // const [consumos, predicciones] = this.data.consumptions.total_data;

        // const adaptedSeries = [
        //     {
        //         name: consumos.name,
        //         data: consumos.data.map(({ month, consumption }) => ({
        //             x: month,
        //             y: consumption,
        //         })),
        //     },
        //     {
        //         name: predicciones.name,
        //         data: [consumos.data.at(-1), ...predicciones.data].map(
        //             ({ month, consumption }) => ({ x: month, y: consumption })
        //         ),
        //     },
        // ];

        this.chartConsumptions = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                width: '100%',
                height: '100%',
                type: 'area',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
                events: {
                    markerClick: (event: any, chartContext: any, { seriesIndex, dataPointIndex, config }: any) => {
                        const seriesName = chartContext.opts.series[seriesIndex].name;
                        if (seriesName === 'Consumo') {
                            this.onDataPointSelected(seriesIndex, dataPointIndex, chartContext.opts);
                        } else if (seriesName === 'Predicción') {
                            this.openPredictionWarning();
                        }
                    }
                },
            },
            markers: {
                size: 5,
                colors: ['#818CF8', '#FBBF24'],
                strokeWidth: 2,
                strokeColors: '#ffffff',
                hover: {
                    size: 7,
                }
            },
            colors: ['#818CF8', '#FBBF24'],
            dataLabels: {
                enabled: false,
            },
            fill: {
                colors: ['#312E81', '#FBBF24'],
                opacity: 0.5,
            },
            grid: {
                show: true,
                borderColor: '#334155',
                padding: {
                    left: 13,
                    right: 0,
                    top: 10,
                    bottom: -40,
                },
                position: 'back',
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 5,
                markers: {
                    width: 12,
                    height: 12,
                    radius: 12,
                },
                labels: {
                    colors: '#E2E8F0',
                },
            },
            series: adaptedSeries,
            stroke: {
                width: 2,
                curve: 'smooth',
                lineCap: 'butt',
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
                x: {
                    formatter: (value: number) => {
                        return new Date(value).toLocaleDateString('es-PE', {
                            month: 'long',
                            year: 'numeric'
                        });
                    }
                },
                y: {
                    formatter: (value: number): string => `${value} kW.h`,
                },
            },
            xaxis: {
                type: 'datetime',
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    stroke: {
                        color: '#475569',
                        dashArray: 0,
                        width: 2,
                    },
                },
                labels: {
                    offsetY: -20,
                    offsetX: 30,
                    style: {
                        colors: '#CBD5E1',
                    },
                },
                tickAmount: 20,
                tooltip: {
                    enabled: false,
                },
                
            },
            yaxis: {
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#334155',
                },
                tickAmount: 5,
                show: true,
                labels: {
                    style: {
                        colors: '#CBD5E1',
                    },
                    formatter: (val: number): string => val.toFixed(2),
                },
            },
        };

        this._cdr.markForCheck();
    }

    searchSupply(): void {
        this._supplyService.getSupplyByCode(this.codigoSuministro).subscribe({
            next: (res) => {
                this.supplies = res;
                this._cdr.detectChanges();
    
                if (res.length === 1) {
                    this.onSelectSupply(res[0]);
                    this._cdr.markForCheck();
                } else if (res.length === 0) {
                    this._amptrackConfirmationService.open({
                        title: 'Suministro no encontrado',
                        message: `No se encontró ningún suministro con el código ${this.codigoSuministro}.`,
                        icon: {
                            show: true,
                            name: 'heroicons_outline:exclamation-triangle',
                            color: 'warn',
                        },
                        actions: {
                            confirm: {
                                show: true,
                                label: 'Entendido',
                                color: 'primary',
                            },
                            cancel: {
                                show: false,
                            },
                        },
                        dismissible: true,
                    });
                }
            },
            error: () => {
                this.supplies = [];
                this.selectedSupply = null;
    
                this._amptrackConfirmationService.open({
                    title: 'Error en la búsqueda',
                    message: `Ocurrió un error al buscar el suministro. Inténtalo nuevamente.`,
                    icon: {
                        show: true,
                        name: 'heroicons_outline:exclamation-triangle',
                        color: 'warn',
                    },
                    actions: {
                        confirm: {
                            show: true,
                            label: 'Cerrar',
                            color: 'warn',
                        },
                        cancel: {
                            show: false,
                        },
                    },
                    dismissible: true,
                });
            },
        });
    }
    

    onSelectSupply(supply: Supply): void {
        this.selectedSupply = supply;
        this.queryDate = new Date();
        this.selectedSystem = supply.cod_sist ?? '';
        this.selectedTariff;

        localStorage.setItem('selectedSupply', JSON.stringify(supply));

        this._consumptionsService
            .getArimaPredict(this.selectedSystem, this.selectedTariff)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (data) => {
                    this.data = data;
                    this._prepareChartData();
                },
                error: () => {
                    this.data = null;
                },
            });
    }

    resetSelectedSupply(): void {
        this.selectedSupply = null;
        this.supplies = [];
        this.codigoSuministro = '';
        localStorage.removeItem('selectedSupply');
    }

    predictConsumption(): void {
        if (!this.fechaSeleccionada) {
            this.showError = true;
            return;
        }

        const [year, month] = this.fechaSeleccionada.split('-').map(Number);

        this._consumptionsService
            .getXGBoostPredict(
                this.selectedSystem,
                year,
                month,
                this.selectedTariff
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    this.predictedConsumptionXGB = response.prediccion_kwh;
                    this.fechaPredicha = true;
                    this.showError = false;
                    this._cdr.detectChanges();
                },
                error: (err) => {
                    this.showError = true;
                },
            });
    }

    resetXGBoostCard() {
        this.fechaPredicha = false;
        this.showError = false;
        this.fechaSeleccionada = '';
    }

    createHistoryReg(consumo: number): void {
        const dialogRef = this._amptrackConfirmationService.open({
            title: `¿Marcar ${consumo.toFixed(2)} kW.h como observado?`,
            message: `Detectamos un consumo de ${consumo.toFixed(2)} kW.h que podría representar una posible pérdida no técnica. ¿Deseas marcarlo como observado?`,
            icon: {
                show: true,
                name: 'heroicons_outline:eye',
                color: 'primary',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Sí, marcar',
                    color: 'accent',
                },
                cancel: {
                    show: true,
                    label: 'Cancelar',
                },
            },
            dismissible: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const entry: HistoryCreate = {
                    titulo: 'Anomalía de Consumo',
                    descripcion: 'Consumo observado fuera del patrón esperado',
                    cod_empresa: this.selectedSupply?.empresa || '',
                    razon_social: this.selectedSupply?.razon_social || '',
                    sistema_electrico: this.selectedSupply?.cod_sist || '',
                    tarifa: this.selectedTariff,
                    consumo: Number(consumo.toFixed(4)),
                    creado_por: this.loggedUser,
                    estado: 0,
                };

                this._historyService.create(entry).subscribe({
                    next: () => {
                        console.log('🎯 Consumo observado guardado en historial.');

                        const notification: NotificationCreate = {
                            icono: 'heroicons_mini:bolt',
                            titulo: 'Consumo observado',
                            descripcion: `Se ha marcado un consumo de ${consumo.toFixed(2)} kW.h como observado.`,
                            leido: false,
                            imagen: '',
                            enlace: 'apps/history',
                            redirige: true,
                        };
    
                        this._notificationService.create(notification).subscribe({
                            next: () => {
                            },
                            error: (err) => {
                            },
                        });
    
                        this._cdr.detectChanges();
                    },
                    error: (err) => {
                        console.error(err);
                    },
                });
            }
        });
    }

    onDataPointSelected(seriesIndex: number, dataPointIndex: number, chartOptions: any): void {
        const serie = chartOptions.series[seriesIndex];
        const consumo = serie.data[dataPointIndex].y;
    
        console.log('📈 Consumo seleccionado:', consumo);
    
        this.createHistoryReg(consumo);
    }
    

    openPredictionWarning(): void {
        this._amptrackConfirmationService.open({
            title: 'No permitido en predicciones',
            message: 'No puedes marcar puntos de predicciones como observados. Solo los consumos reales pueden ser evaluados.',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Entendido',
                    color: 'primary',
                },
                cancel: {
                    show: false,
                },
            },
            dismissible: true,
        });
    }
    
}
