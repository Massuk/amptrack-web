import { Injectable } from '@angular/core';
import { AmpTrackMockApiService } from '@amptrack/lib/mock-api';
import {
    faqCategories as faqCategoriesData,
    faqs as faqsData,
} from 'app/mock-api/apps/help-center/data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class HelpCenterMockApi {
    private _faqCategories: any[] = faqCategoriesData;
    private _faqs: any[] = faqsData;

    constructor(private _amptrackMockApiService: AmpTrackMockApiService) {
        this.registerHandlers();
    }
    registerHandlers(): void {
        this._amptrackMockApiService
            .onGet('api/apps/help-center/faqs')
            .reply(({ request }) => {
                const slug = request.params.get('slug');

                const results = [];

                const faqs = cloneDeep(this._faqs);

                const categories = cloneDeep(this._faqCategories);
                if (!slug) {
                    categories.forEach((category) => {
                        results.push({
                            ...category,
                            faqs: faqs.filter(
                                (faq) => faq.categoryId === category.id
                            ),
                        });
                    });
                }
                else {
                    const category = categories.find(
                        (item) => item.slug === slug
                    );

                    results.push({
                        ...category,
                        faqs: faqs.filter(
                            (faq) => faq.categoryId === category.id
                        ),
                    });
                }

                return [200, results];
            });
    }
}
