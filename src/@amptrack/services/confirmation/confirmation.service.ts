import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AmpTrackConfirmationConfig } from '@amptrack/services/confirmation/confirmation.types';
import { AmpTrackConfirmationDialogComponent } from '@amptrack/services/confirmation/dialog/dialog.component';
import { merge } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class AmpTrackConfirmationService {
    private _matDialog: MatDialog = inject(MatDialog);
    private _defaultConfig: AmpTrackConfirmationConfig = {
        title: 'Titulo',
        message: 'Mensaje por defecto',
        icon: {
            show: true,
            name: 'heroicons_outline:exclamation-triangle',
            color: 'warn',
        },
        actions: {
            confirm: {
                show: true,
                label: 'Confirmar',
                color: 'warn',
            },
            cancel: {
                show: true,
                label: 'Cancelar',
            },
        },
        dismissible: false,
    };

    open(
        config: AmpTrackConfirmationConfig = {}
    ): MatDialogRef<AmpTrackConfirmationDialogComponent> {
        const userConfig = merge({}, this._defaultConfig, config);

        return this._matDialog.open(AmpTrackConfirmationDialogComponent, {
            autoFocus: false,
            disableClose: !userConfig.dismissible,
            data: userConfig,
            panelClass: 'amptrack-confirmation-dialog-panel',
        });
    }
}
