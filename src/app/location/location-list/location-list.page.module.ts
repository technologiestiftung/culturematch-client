import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationListPage } from './location-list.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: LocationListPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [LocationListPage],
})
// tslint:disable-next-line
export class LocationListPageModule {}