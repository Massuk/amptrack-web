import { Injectable } from '@angular/core';
import { AmpTrackDrawerComponent } from '@amptrack/components/drawer/drawer.component';

@Injectable({ providedIn: 'root' })
export class AmpTrackDrawerService {
    private _componentRegistry: Map<string, AmpTrackDrawerComponent> = new Map<
        string,
        AmpTrackDrawerComponent
    >();

    registerComponent(name: string, component: AmpTrackDrawerComponent): void {
        this._componentRegistry.set(name, component);
    }

    deregisterComponent(name: string): void {
        this._componentRegistry.delete(name);
    }

    getComponent(name: string): AmpTrackDrawerComponent | undefined {
        return this._componentRegistry.get(name);
    }
}
