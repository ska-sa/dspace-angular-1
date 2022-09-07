import { Component } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { AboutPageComponent } from './about-page.component';

/**
 * Themed wrapper for CommunityListPageComponent
 */
@Component({
  selector: 'ds-themed-about-page',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedAboutPageComponent extends ThemedComponent<AboutPageComponent> {
  protected getComponentName(): string {
    return 'AboutPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/about-page/about-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./about-page.component`);
  }

}
