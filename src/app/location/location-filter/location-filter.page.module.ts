import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationFilterPage } from './location-filter.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: LocationFilterPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [LocationFilterPage],
})
// tslint:disable-next-line
export class LocationFilterPageModule {}