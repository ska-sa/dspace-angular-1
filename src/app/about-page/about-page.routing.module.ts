import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CdkTreeModule } from '@angular/cdk/tree';

import { ThemedAboutPageComponent } from './themed-about-page.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';

/**
 * RouterModule to help navigate to the page with the community list tree
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThemedAboutPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'about.tabTitle', breadcrumbKey: 'about' }
      }
    ]),
    CdkTreeModule,
  ],
})
export class AboutPageRoutingModule {
}
