import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'amptrackFindByKey',
    pure: false,
    standalone: true,
})
export class AmpTrackFindByKeyPipe implements PipeTransform {
    transform(value: string | string[], key: string, source: any[]): any {
        if (Array.isArray(value)) {
            return value.map((item) =>
                source.find((sourceItem) => sourceItem[key] === item)
            );
        }
        return source.find((sourceItem) => sourceItem[key] === value);
    }
}
