import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AboutPageComponent } from './about-page.component';
import { AboutPageRoutingModule } from './about-page.routing.module';
// import { CommunityListPageRoutingModule } from './community-list-page.routing.module';
// import { CommunityListComponent } from './community-list/community-list.component';
// import { ThemedCommunityListPageComponent } from './themed-community-list-page.component';
// import { ThemedCommunityListComponent } from './community-list/themed-community-list.component';


const DECLARATIONS = [
  AboutPageComponent,
];
/**
 * The page which houses a title and the community list, as described in community-list.component
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AboutPageRoutingModule
  ],
  declarations: [
    ...DECLARATIONS
  ],
  exports: [
    ...DECLARATIONS,
  ],
})
export class AboutPageModule {

}
