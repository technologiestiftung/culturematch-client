import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationDetailPage } from './location-detail.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: LocationDetailPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [LocationDetailPage],
})
// tslint:disable-next-line
export class LocationDetailPageModule {}